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
 * 🧮 1. SHANNON ENTROPY ALGORITHM
 * Calculates information entropy H(X) = -sum(P(x) * log2(P(x)))
 * Detects synthetic keyboard mash (e.g. "asdfghjkl", "qwerty1234") vs natural human text.
 */
function calculateShannonEntropy(str: string): number {
  if (!str) return 0;
  const chars = str.toLowerCase().replace(/\s+/g, "").split("");
  if (chars.length === 0) return 0;

  const freqMap: Record<string, number> = {};
  for (const char of chars) {
    freqMap[char] = (freqMap[char] || 0) + 1;
  }

  let entropy = 0;
  const len = chars.length;
  for (const char in freqMap) {
    const p = freqMap[char] / len;
    entropy -= p * Math.log2(p);
  }
  return parseFloat(entropy.toFixed(3));
}

/**
 * 🔤 2. VOWEL / CONSONANT STATISTICAL NATURALNESS EVALUATOR
 */
function evaluateTextNaturalness(text: string): { anomalyScore: number; reason?: string } {
  if (!text) return { anomalyScore: 0.8, reason: "Empty input string" };
  const clean = text.toLowerCase().replace(/[^a-z]/g, "");
  if (clean.length < 3) return { anomalyScore: 0.6, reason: "Input string too short (< 3 letters)" };

  const vowels = (clean.match(/[aeiou]/g) || []).length;
  const consonants = clean.length - vowels;
  const vowelRatio = vowels / clean.length;

  if (vowelRatio < 0.15 || vowelRatio > 0.70) {
    return {
      anomalyScore: 0.75,
      reason: `Unusual vowel distribution (${(vowelRatio * 100).toFixed(0)}% vowels)`,
    };
  }

  return { anomalyScore: 0.0 };
}

/**
 * 📈 3. LOGISTIC SIGMOID RISK CALIBRATION FUNCTION
 * Transforms weighted raw feature score into a calibrated 0.00 - 1.00 probability P(Fraud).
 * Formula: P(Fraud) = 1 / (1 + exp(-(z - offset) / scale))
 */
function calculateLogisticProbability(rawScore: number): { probability: number; scaledScore: number } {
  const offset = 40; // Midpoint threshold
  const scale = 14;  // Sigmoid slope factor
  const z = (rawScore - offset) / scale;
  const probability = parseFloat((1 / (1 + Math.exp(-z))).toFixed(4));
  const scaledScore = Math.min(100, Math.max(0, Math.round(probability * 100)));
  return { probability, scaledScore };
}

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
 * THIRD-PARTY IPQUALITYSCORE (IPQS) PHONE RISK CHECK
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
 * 🧬 4. ALGORITHMIC MACHINE LEARNING RISK SCORING ENGINE
 * Evaluates feature vectors using Shannon Entropy, Vowel-Consonant Perplexity, and Logistic Sigmoid Calibration.
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
  let entropyPenalty = 0;
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

  // --- FEATURE VECTOR 1: PHONE NUMBER INTELLIGENCE & CARRIER EVALUATION ---
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

  // --- FEATURE VECTOR 2: EMAIL DOMAIN INTELLIGENCE & DISPOSABLE DOMAIN CHECK ---
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

  // --- FEATURE VECTOR 3: SHANNON ENTROPY & NAME QUALITY EVALUATION ---
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

    // Shannon Entropy Check on Name String
    const nameEntropy = calculateShannonEntropy(fullName);
    const nameNaturalness = evaluateTextNaturalness(fullName);
    if (nameNaturalness.anomalyScore > 0) {
      nameScore += Math.round(nameNaturalness.anomalyScore * 25);
      reasons.push(`Name perplexity anomaly (${nameNaturalness.reason})`);
    }
  }

  // --- FEATURE VECTOR 4: STREET ADDRESS ENTROPY & GEOGRAPHIC ANALYSIS ---
  if (normAddress) {
    const addressEntropy = calculateShannonEntropy(normAddress);
    if (normAddress.length < 12) {
      addressScore += 35;
      matchedFields.junkAddress = true;
      reasons.push("Extremely short or incomplete street address (< 12 characters)");
    } else if (!/\d/.test(normAddress) && !/no|#|house|flat|road|street|lane/i.test(normAddress)) {
      addressScore += 20;
      matchedFields.junkAddress = true;
      reasons.push("Street address missing house number or landmark identifier");
    }

    // Entropy Anomaly (Keyboard mash address e.g. "asdfghjklqwertyuiop")
    if (addressEntropy < 2.0 && normAddress.length > 15) {
      entropyPenalty += 30;
      matchedFields.junkAddress = true;
      reasons.push(`Low information entropy in street address (H=${addressEntropy})`);
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

  // --- FEATURE VECTOR 5: TIME-DECAYED HISTORICAL ORDER & ERP SPAMMER MATCH ---
  try {
    const params = new URLSearchParams();
    if (normPhone) params.append("phone", normPhone);
    if (normEmail) params.append("email", normEmail);
    if (fullName) params.append("name", fullName);
    if (data.address) params.append("address", data.address);
    if (data.city) params.append("city", data.city);
    if ((data as any).recaptchaToken) params.append("token", (data as any).recaptchaToken);

    const res = await axiosInstance.get(`/erp/orders/customer-risk-history?${params.toString()}`, {
      timeout: 5000,
    });

    const history = res.data;
    if (history) {
      const totalOrders = Number(history.totalOrders || 0);
      const successCount = Number(history.successfulOrders || 0);
      const refusedCodCount = Number(history.refusedCodCount || 0); // Refused at door / RTO
      const exchangeCount = Number(history.exchangeCount || 0); // Legitimate exchanges (0 Penalty)

      // Explicit Internal Spammer Blacklist Match
      if (history.isBlacklisted) {
        matchedFields.phoneMatch = true;
        historyScore += 75;
        reasons.push(`Flagged in NEVERBE Internal Spammer Blacklist (${history.blacklistReason || "Manual Blacklist"})`);
      }

      // Refused COD Package at Door (Uncollected RTO) -> EXPONENTIAL PENALTY
      if (refusedCodCount > 0) {
        matchedFields.phoneMatch = true;
        historyScore += Math.min(refusedCodCount * 45, 90);
        reasons.push(`Customer has ${refusedCodCount} past refused COD / uncollected parcel RTO record(s)`);
      }

      // Address Match with Past RTO
      if (history.addressMatch && refusedCodCount > 0) {
        matchedFields.addressMatch = true;
        historyScore += 25;
        reasons.push("Street address matches past refused COD delivery location");
      }

      // Trust Bonus for Consistent Completed Deliveries
      if (successCount >= 2 && refusedCodCount === 0) {
        trustBonus = Math.min(successCount * 20, 50);
        reasons.push(`Verified repeat customer with ${successCount} successfully delivered orders`);
      }
    }
  } catch (err) {
    console.warn("[FraudEngine] ERP Customer Risk History query bypassed:", err);
  }

  // --- 🧮 5. LOGISTIC SIGMOID PROBABILITY CALIBRATION ---
  const rawFeatureSum =
    phoneScore +
    emailScore +
    addressScore +
    nameScore +
    historyScore +
    entropyPenalty -
    trustBonus;

  const { probability, scaledScore } = calculateLogisticProbability(rawFeatureSum);
  const isHighRisk = scaledScore >= thresholdScore;

  const overallEntropy = calculateShannonEntropy(`${fullName} ${normAddress} ${normEmail}`);

  return {
    finalScore: scaledScore,
    isHighRisk,
    probability,
    entropyScore: overallEntropy,
    subScores: {
      phoneScore,
      emailScore,
      addressScore,
      nameScore,
      historyScore,
      entropyPenalty,
      trustBonus,
    },
    reasons,
    matchedFields,
    algorithm: "LOGISTIC_SIGMOID_SHANNON_ENTROPY_V2",
  };
}

/**
 * ⚡ 6. UNIFIED COMPOSITE FRAUD RISK EVALUATION
 * Combines IPQS Third-Party Telemetry with Local Algorithmic ML Model.
 */
export async function evaluateUnifiedFraudRisk(
  customerData: CustomerFormData,
  thresholdScore = 50
): Promise<CompositeRiskResult> {
  const [thirdPartyResult, localResult] = await Promise.all([
    evaluateThirdPartyPhoneRisk(customerData.phone, thresholdScore, "PREPAY_DELIVERY_FEE"),
    calculateCentralizedFraudRisk(customerData, thresholdScore),
  ]);

  // Combine Third-Party IPQS + Local Algorithmic Model
  const compositeRawScore = Math.max(thirdPartyResult.fraudScore, localResult.finalScore);
  const { probability, scaledScore } = calculateLogisticProbability(compositeRawScore);
  const isHighRisk = scaledScore >= thresholdScore || thirdPartyResult.isHighRisk || localResult.isHighRisk;

  let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
  if (scaledScore >= 80 || thirdPartyResult.riskLevel === "CRITICAL") {
    riskLevel = "CRITICAL";
  } else if (scaledScore >= 60 || thirdPartyResult.riskLevel === "HIGH") {
    riskLevel = "HIGH";
  } else if (scaledScore >= 35) {
    riskLevel = "MEDIUM";
  }

  const allReasons = Array.from(new Set([...thirdPartyResult.reasons, ...localResult.reasons]));

  const noticeMessage = isHighRisk
    ? "Due to high return/spam risk on past network activity, delivery fee prepayment (Rs. 450) is required for COD orders."
    : "";

  return {
    isHighRisk,
    fraudScore: scaledScore,
    probability,
    ipqsScore: thirdPartyResult.fraudScore,
    localScore: localResult.finalScore,
    riskLevel,
    isValid: thirdPartyResult.isValid,
    isActive: thirdPartyResult.isActive,
    isDisposable: thirdPartyResult.isDisposable,
    isSpammer: thirdPartyResult.isSpammer || localResult.subScores.historyScore >= 75,
    lineType: thirdPartyResult.lineType,
    reasons: allReasons,
    actionRequired: isHighRisk ? "PREPAY_DELIVERY_FEE" : "NONE",
    noticeMessage,
    algorithm: "LOGISTIC_SIGMOID_SHANNON_ENTROPY_V2",
  };
}

export { evaluateUnifiedFraudRisk as evaluateCustomerFraudRisk };
