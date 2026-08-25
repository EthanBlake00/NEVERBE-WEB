export interface CustomerFormData {
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  zip?: string;
}

export interface ThirdPartyRiskResult {
  isHighRisk: boolean;
  fraudScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isValid: boolean;
  isActive: boolean;
  isDisposable: boolean;
  isSpammer: boolean;
  lineType: string;
  reasons: string[];
  actionRequired: "PREPAY_DELIVERY_FEE" | "FULL_PREPAYMENT_ONLY" | "FLAG_FOR_MANUAL_REVIEW" | "NONE";
  noticeMessage: string;
}

export interface FraudEngineResult {
  finalScore: number; // 0 - 100
  isHighRisk: boolean;
  probability: number; // 0.0 - 1.0 (Calibrated Logistic Probability)
  entropyScore: number; // Shannon Entropy of customer inputs
  subScores: {
    phoneScore: number;
    emailScore: number;
    addressScore: number;
    nameScore: number;
    historyScore: number;
    entropyPenalty: number;
    trustBonus: number;
  };
  reasons: string[];
  matchedFields: {
    phoneMatch: boolean;
    emailMatch: boolean;
    addressMatch: boolean;
    junkAddress: boolean;
    junkName: boolean;
    invalidCarrier: boolean;
  };
  algorithm: "LOGISTIC_SIGMOID_SHANNON_ENTROPY_V2";
}

export interface CompositeRiskResult {
  isHighRisk: boolean;
  fraudScore: number;
  probability: number; // Calibrated probability (0.00 - 1.00)
  ipqsScore: number;
  localScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  isValid: boolean;
  isActive: boolean;
  isDisposable: boolean;
  isSpammer: boolean;
  lineType: string;
  reasons: string[];
  actionRequired: "PREPAY_DELIVERY_FEE" | "FULL_PREPAYMENT_ONLY" | "FLAG_FOR_MANUAL_REVIEW" | "NONE";
  noticeMessage: string;
  algorithm: "LOGISTIC_SIGMOID_SHANNON_ENTROPY_V2";
}
