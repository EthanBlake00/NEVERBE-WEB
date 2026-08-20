import { NextRequest, NextResponse } from "next/server";
import { evaluateUnifiedFraudRisk, CustomerFormData } from "@/actions/FraudEngine";

/**
 * REST API Endpoint: POST /api/v1/fraud-check
 * Evaluates comprehensive customer fraud risk using Third-Party IPQS + Internal Multi-Attribute Rules.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || (!body.phone && !body.email && !body.address)) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one customer identification field (phone, email, address) is required.",
        },
        { status: 400 }
      );
    }

    const customerData: CustomerFormData = {
      phone: String(body.phone || ""),
      email: String(body.email || ""),
      first_name: String(body.first_name || body.firstName || ""),
      last_name: String(body.last_name || body.lastName || ""),
      address: String(body.address || ""),
      city: String(body.city || ""),
      zip: body.zip ? String(body.zip) : undefined,
    };

    const thresholdScore = body.thresholdScore ? Number(body.thresholdScore) : 50;

    const riskResult = await evaluateUnifiedFraudRisk(customerData, thresholdScore);

    return NextResponse.json({
      success: true,
      data: riskResult,
    });
  } catch (error: any) {
    console.error("[API Fraud Check Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process fraud risk analysis",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "FraudEngine API",
    version: "1.0.0",
    endpoint: "POST /api/v1/fraud-check",
  });
}
