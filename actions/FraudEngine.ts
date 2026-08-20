"use server";

import axios from "axios";
import axiosInstance from "@/actions/axiosInstance";

import {
  CustomerFormData,
  ThirdPartyRiskResult,
  FraudEngineResult,
  CompositeRiskResult,
} from "@/interfaces";

export type {
  CustomerFormData,
  ThirdPartyRiskResult,
  FraudEngineResult,
  CompositeRiskResult,
};

// Expanded Disposable Email Domain Blacklist
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "10minutemail.com",
  "tempmail.com",
  "guerrillamail.com",
  "throwawaymail.com",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "dispostable.com",
  "mailnesia.com",
  "maildrop.cc",
  "sharklasers.com",
  "binkmail.com",
  "safetymail.info",
  "temp-mail.org",
  "fakemailgenerator.com",
  "emailondeck.com",
]);

// Common Email Domain Typos
const TYPO_EMAIL_DOMAINS: Record<string, string> = {
  "gmal.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "hotmal.com": "hotmail.com",
  "outlok.com": "outlook.com",
};

// Test / Junk Name Regex Patterns
const JUNK_NAME_PATTERNS = [
  /^test$/i,
  /^asdf$/i,
  /^admin$/i,
  /^user$/i,
  /^fake$/i,
  /^demo$/i,
  /^sample$/i,
  /^null$/i,
  /^undefined$/i,
  /^\w$/, // Single character name
  /^\d+$/, // All numeric name
  /[!@#$%^&*()_+={}\[\]:;<>?,]/, // Special symbols in name
];

// Sequential or Repeated Dummy Phone Patterns
const DUMMY_PHONE_PATTERNS = [
  /07[0-8]1234567/,
  /07[0-8]7654321/,
  /07[0-8]0000000/,
  /(\d)\1{7,}/, // e.g. 0777777777
];

// Valid Sri Lankan Mobile Operator Prefixes
const VALID_SL_MOBILE_PREFIXES = ["070", "071", "072", "074", "075", "076", "077", "078"];

/**
 * Format Sri Lankan phone number to digits only (e.g. 0771234567)
 */
function normalizePhoneDigits(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("94")) {
    cleaned = "0" + cleaned.substring(2);
  }
  return cleaned;
}

/**
 * Format Sri Lankan phone numbers to international E.164 format (+94...)
 */
function formatSriLankaPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("94")) {
    return `+${cleaned}`;
  }
  if (cleaned.startsWith("0")) {
    return `+94${cleaned.substring(1)}`;
  }
  if (cleaned.length === 9) {
    return `+94${cleaned}`;
  }
  return `+${cleaned}`;
}

/**
 * 1. THIRD-PARTY IPQUALITYSCORE (IPQS) PHONE RISK CHECK
 */
export async function evaluateThirdPartyPhoneRisk(
  rawPhone: string,
  thresholdScore = 60,
  actionMode: "PREPAY_DELIVERY_FEE" | "FULL_PREPAYMENT_ONLY" | "FLAG_FOR_MANUAL_REVIEW" = "PREPAY_DELIVERY_FEE"
): Promise<ThirdPartyRiskResult> {
  const defaultResult: ThirdPartyRiskResult = {
    isHighRisk: false,
    fraudScore: 0,
    riskLevel: "LOW",
    isValid: true,
    isActive: true,
    isDisposable: false,
    isSpammer: false,
    lineType: "Mobile",
    reasons: [],
    actionRequired: "NONE",
    noticeMessage: "",
  };

  if (!rawPhone || rawPhone.trim().length < 8) {
    return defaultResult;
  }

  const apiKey = "UXyahAsjd1X9os7l0tzrQbJwrG4RepQb";

  try {
    const formattedPhone = formatSriLankaPhone(rawPhone);
    const url = `https://www.ipqualityscore.com/api/json/phone/${encodeURIComponent(apiKey)}/${encodeURIComponent(formattedPhone)}?strictness=1`;

    const response = await axios.get(url, { timeout: 5000 });
    const data = response.data;

    if (!data || data.success === false) {
      console.warn("[IPQS] API Request Warning:", data?.message || "Unknown error");
      return defaultResult;
    }

    const fraudScore = Number(data.fraud_score || 0);
    const isValid = Boolean(data.valid !== false);
    const isActive = Boolean(data.active !== false);
    const isDisposable = Boolean(data.disposable || data.temporary);
    const isSpammer = Boolean(data.spammer || data.leaked);
    const lineType = String(data.line_type || "Mobile");

    const reasons: string[] = [];
    if (fraudScore >= thresholdScore) {
      reasons.push(`High IPQS Fraud Score (${fraudScore}/100)`);
    }
    if (!isValid) {
      reasons.push("Invalid or unreachable mobile number");
    }
    if (!isActive) {
      reasons.push("Inactive / Disconnected line status");
    }
    if (isDisposable) {
      reasons.push("Disposable or temporary VOIP virtual line");
    }
    if (isSpammer) {
      reasons.push("Identified in global spammer / fraud databases");
    }

    const isHighRisk = fraudScore >= thresholdScore || !isValid || isDisposable || isSpammer;

    let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
    if (fraudScore >= 85 || isSpammer) {
      riskLevel = "CRITICAL";
    } else if (fraudScore >= 60 || isDisposable) {
      riskLevel = "HIGH";
    } else if (fraudScore >= 40) {
      riskLevel = "MEDIUM";
    }

    const noticeMessage = isHighRisk
      ? "Due to high return/spam risk on past network activity, delivery fee prepayment (Rs. 450) is required for COD orders."
      : "";

    return {
      isHighRisk,
      fraudScore,
      riskLevel,
      isValid,
      isActive,
      isDisposable,
      isSpammer,
      lineType,
      reasons,
      actionRequired: isHighRisk ? actionMode : "NONE",
      noticeMessage,
    };
  } catch (error: any) {
    console.error("[IPQS Risk Check Error]:", error.message || error);
    return defaultResult;
  }
}

/**
 * 2. INTERNAL MULTI-ATTRIBUTE LOCAL RISK ENGINE
 */
export async function calculateCentralizedFraudRisk(
  data: CustomerFormData,
  thresholdScore = 50
): Promise<FraudEngineResult> {
  let phoneScore = 0;
  let emailScore = 0;
  let addressScore = 0;
  let nameScore = 0;
  let historyScore = 0;
  let trustBonus = 0;

  const reasons: string[] = [];
  const matchedFields = {
    phoneMatch: false,
    emailMatch: false,
    addressMatch: false,
    junkAddress: false,
    junkName: false,
    invalidCarrier: false,
  };

  const normPhone = normalizePhoneDigits(data.phone || "");
  const normEmail = (data.email || "").trim().toLowerCase();
  const normAddress = (data.address || "").trim().toLowerCase();
  const normCity = (data.city || "").trim().toLowerCase();
  const firstName = (data.first_name || "").trim();
  const lastName = (data.last_name || "").trim();
  const fullName = `${firstName} ${lastName}`.trim();

  // 1. PHONE NUMBER INTELLIGENCE & CARRIER CHECK
  if (normPhone) {
    if (normPhone.length !== 10) {
      phoneScore += 35;
      reasons.push("Invalid mobile number length");
    } else {
      const prefix = normPhone.substring(0, 3);
      if (!VALID_SL_MOBILE_PREFIXES.includes(prefix)) {
        phoneScore += 30;
        matchedFields.invalidCarrier = true;
        reasons.push(`Non-mobile / fixed landline prefix (${prefix}) used for mobile delivery SMS`);
      }
    }

    if (DUMMY_PHONE_PATTERNS.some((pattern) => pattern.test(normPhone))) {
      phoneScore += 45;
      reasons.push("Sequential or repeated dummy phone number pattern");
    }
  } else {
    phoneScore += 50;
    reasons.push("Missing customer phone number");
  }

  // 2. EMAIL DOMAIN INTELLIGENCE & TYPO CHECK
  if (normEmail) {
    const domain = normEmail.split("@")[1];
    if (domain) {
      if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
        emailScore += 40;
        matchedFields.emailMatch = true;
        reasons.push("Disposable or temporary burner email domain");
      }
      if (TYPO_EMAIL_DOMAINS[domain]) {
        emailScore += 20;
        reasons.push(`Suspicious email domain typo (${domain} -> ${TYPO_EMAIL_DOMAINS[domain]})`);
      }
    }
    if (normEmail.includes("test@") || normEmail.includes("fake@")) {
      emailScore += 35;
      reasons.push("Test / placeholder email address");
    }
  }

  // 3. CUSTOMER NAME QUALITY
  if (!firstName) {
    nameScore += 20;
    reasons.push("Missing first name");
  }
  if (!lastName) {
    nameScore += 15;
    reasons.push("Single-word name provided (missing last name)");
  }
  if (fullName) {
    if (JUNK_NAME_PATTERNS.some((pattern) => pattern.test(firstName) || pattern.test(lastName))) {
      nameScore += 35;
      matchedFields.junkName = true;
      reasons.push("Suspicious or fake name pattern detected");
    }
  }

  // 4. STREET ADDRESS & CITY ACCURACY
  if (normAddress) {
    if (normAddress.length < 12) {
      addressScore += 35;
      matchedFields.junkAddress = true;
      reasons.push("Extremely short or incomplete street address (< 12 characters)");
    } else if (!/\d/.test(normAddress) && !/no|#|house|flat|road|street|lane/i.test(normAddress)) {
      addressScore += 20;
      matchedFields.junkAddress = true;
      reasons.push("Street address missing house number or landmark identifier");
    }

    if (normCity && normAddress === normCity) {
      addressScore += 30;
      matchedFields.junkAddress = true;
      reasons.push("City name duplicated as street address");
    }
  } else {
    addressScore += 50;
    reasons.push("Missing street address");
  }

  // 5. HISTORICAL ORDERS & CONTEXT-AWARE TRUST SCORE
  try {
    const params = new URLSearchParams();
    if (normPhone) params.append("phone", normPhone);
    if (normEmail) params.append("email", normEmail);
    if (fullName) params.append("name", fullName);
    if (data.address) params.append("address", data.address);
    if (data.city) params.append("city", data.city);
    if ((data as any).recaptchaToken) params.append("token", (data as any).recaptchaToken);

    const res = await axiosInstance.get(`/api/v1/erp/orders/customer-risk-history?${params.toString()}`, {
      timeout: 3000,
    });

    const history = res.data;
    if (history) {
      const totalOrders = Number(history.totalOrders || 0);
      const successCount = Number(history.successfulOrders || 0);
      const refusedCodCount = Number(history.refusedCodCount || 0); // Refused at door / RTO
      const exchangeCount = Number(history.exchangeCount || 0); // Legitimate exchanges / size fits (0 Penalty)

      // 1. Explicit Internal Spammer Blacklist Match
      if (history.isBlacklisted) {
        matchedFields.phoneMatch = true;
        historyScore += 75;
        reasons.push(`Flagged in NEVERBE Internal Spammer Blacklist (${history.blacklistReason || "Manual Blacklist"})`);
      }

      // 2. Refused COD Package at Door (Uncollected RTO) -> HIGH PENALTY
      if (refusedCodCount > 0) {
        matchedFields.phoneMatch = true;
        historyScore += Math.min(refusedCodCount * 40, 80);
        reasons.push(`Uncollected Delivery Alert: ${refusedCodCount} past COD packages refused at door`);
      }

      // 3. Serial Return Abuse Check (> 3 orders AND > 50% non-exchange return rate)
      const nonExchangeReturns = Math.max(0, Number(history.returnedOrders || 0) - exchangeCount);
      if (totalOrders >= 3 && nonExchangeReturns >= 2 && (nonExchangeReturns / totalOrders) > 0.5) {
        historyScore += 35;
        reasons.push(`Serial Return Abuser Pattern: ${nonExchangeReturns} uncollected/cancelled returns out of ${totalOrders} orders`);
      }

      // 4. Legitimate Size Exchange Notice (NO PENALTY)
      if (exchangeCount > 0 && refusedCodCount === 0) {
        reasons.push(`Legitimate History: ${exchangeCount} past size exchange/defect returns (0 penalty applied)`);
      }

      // 5. Address Match with Refused COD Delivery
      if (history.addressMatch) {
        matchedFields.addressMatch = true;
        historyScore += 30;
        reasons.push("Exact street address match with past refused COD delivery");
      }

      // 6. Active Pending COD Velocity
      if (history.pendingCodCount >= 2) {
        historyScore += 30;
        reasons.push(`${history.pendingCodCount} active unfulfilled COD orders currently pending`);
      }

      // 7. Context-Aware Trust Bonus
      if (successCount >= 2 && refusedCodCount === 0) {
        trustBonus = 35;
        reasons.push(`Trust Discount: ${successCount} verified delivered orders with 0 delivery refusals`);
      }
    }
  } catch (err) {
    // Graceful fallback if internal API is unreachable
  }

  const rawScore =
    phoneScore * 0.3 +
    historyScore * 0.3 +
    addressScore * 0.2 +
    emailScore * 0.1 +
    nameScore * 0.1 -
    trustBonus;

  const finalScore = Math.max(0, Math.min(Math.round(rawScore), 100));
  const isHighRisk = finalScore >= thresholdScore;

  return {
    finalScore,
    isHighRisk,
    subScores: {
      phoneScore,
      emailScore,
      addressScore,
      nameScore,
      historyScore,
      trustBonus,
    },
    reasons,
    matchedFields,
  };
}

/**
 * 3. CENTRALIZED UNIFIED FRAUD EVALUATOR (IPQS Third-Party + Internal Engine)
 */
export async function evaluateUnifiedFraudRisk(
  customerData: CustomerFormData,
  thresholdScore = 50,
  actionMode: "PREPAY_DELIVERY_FEE" | "FULL_PREPAYMENT_ONLY" | "FLAG_FOR_MANUAL_REVIEW" = "PREPAY_DELIVERY_FEE"
): Promise<CompositeRiskResult> {
  // 1. Run Centralized Internal Engine
  const localRisk = await calculateCentralizedFraudRisk(customerData, thresholdScore);

  // 2. Run IPQS Third-Party API (with graceful fallback)
  let ipqsRisk = await evaluateThirdPartyPhoneRisk(customerData.phone, thresholdScore, actionMode);

  const engineUsed = ipqsRisk.fraudScore > 0 ? "THIRD_PARTY_AND_LOCAL" : "LOCAL_ONLY_FALLBACK";
  const finalScore = Math.max(ipqsRisk.fraudScore, localRisk.finalScore);
  const isHighRisk = finalScore >= thresholdScore || localRisk.isHighRisk || ipqsRisk.isHighRisk;

  const combinedReasons = Array.from(new Set([...localRisk.reasons, ...ipqsRisk.reasons]));

  let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
  if (finalScore >= 85 || ipqsRisk.isSpammer) {
    riskLevel = "CRITICAL";
  } else if (finalScore >= 60 || ipqsRisk.isDisposable || localRisk.isHighRisk) {
    riskLevel = "HIGH";
  } else if (finalScore >= 40) {
    riskLevel = "MEDIUM";
  }

  const noticeMessage = isHighRisk
    ? "Due to high return/spam risk flagged on past order/network history, delivery fee prepayment (Rs. 450) is required for COD orders."
    : "";

  return {
    isHighRisk,
    fraudScore: finalScore,
    ipqsScore: ipqsRisk.fraudScore,
    localScore: localRisk.finalScore,
    riskLevel,
    isValid: ipqsRisk.isValid,
    isActive: ipqsRisk.isActive,
    isDisposable: ipqsRisk.isDisposable,
    isSpammer: ipqsRisk.isSpammer,
    lineType: ipqsRisk.lineType,
    reasons: combinedReasons,
    actionRequired: isHighRisk ? actionMode : "NONE",
    noticeMessage,
    engineUsed,
  };
}

// Aliases for Backward Compatibility
export { evaluateUnifiedFraudRisk as evaluateCustomerFraudRisk };
export { calculateCentralizedFraudRisk as calculateLocalMultiAttributeRisk };
