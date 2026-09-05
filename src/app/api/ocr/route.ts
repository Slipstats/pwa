import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType = "image/jpeg" } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64 data" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Graceful fallback with realistic structured OCR data if key is not yet configured
      return NextResponse.json({
        success: true,
        source: "seed-fallback",
        message: "Gemini API key not configured in GEMINI_API_KEY. Using sample slip OCR data.",
        data: {
          vendor: "Checkers Hyper Sandton",
          invoice_date: new Date().toISOString().split("T")[0],
          receipt_number: "CK-49102",
          gross_total: 184.6,
          currency: "ZAR",
          ocr_confidence: 99.4,
          items: [
            {
              item_name: "Pampers Premium Diapers Size 4 (68pk)",
              quantity: 1,
              unit_price: 34.99,
              line_total: 34.99,
              is_child_qualifying: true,
              suggested_category: "Nutrition & Hygiene",
              exclusion_reason: null,
            },
            {
              item_name: "Similac Infant Formula 850g x2",
              quantity: 2,
              unit_price: 24.25,
              line_total: 48.5,
              is_child_qualifying: true,
              suggested_category: "Nutrition & Hygiene",
              exclusion_reason: null,
            },
            {
              item_name: "Colgate Kids Bubblegum Toothpaste",
              quantity: 1,
              unit_price: 4.9,
              line_total: 4.9,
              is_child_qualifying: true,
              suggested_category: "Nutrition & Hygiene",
              exclusion_reason: null,
            },
            {
              item_name: "Nurofen Children 200ml Strawberry",
              quantity: 1,
              unit_price: 24.01,
              line_total: 24.01,
              is_child_qualifying: true,
              suggested_category: "Medical Aid / Doctor",
              exclusion_reason: null,
            },
            {
              item_name: "Organic Espresso Beans 500g",
              quantity: 1,
              unit_price: 18.2,
              line_total: 18.2,
              is_child_qualifying: false,
              suggested_category: "Other",
              exclusion_reason: "Personal non-qualifying adult item",
            },
            {
              item_name: "Sparkling Mineral Water 6pk",
              quantity: 1,
              unit_price: 12.0,
              line_total: 12.0,
              is_child_qualifying: false,
              suggested_category: "Other",
              exclusion_reason: "Personal non-qualifying beverage",
            },
            {
              item_name: "Whole Milk & Bananas Snack",
              quantity: 3,
              unit_price: 14.0,
              line_total: 42.0,
              is_child_qualifying: true,
              suggested_category: "Nutrition & Hygiene",
              exclusion_reason: null,
            },
          ],
        },
      });
    }

    // Strip header if provided (e.g. data:image/jpeg;base64,...)
    const cleanBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;

    const prompt = `You are an expert forensic document and till slip parser for family court maintenance claims under the South African Maintenance Act 99 of 1998.
Extract the vendor name, invoice date (YYYY-MM-DD), receipt or tax invoice number, gross total amount, and every line item from this till slip / receipt photo.
For each line item:
- item_name: Name of item exactly as printed
- quantity: Number of units purchased
- unit_price: Price per unit
- line_total: Total for the line
- is_child_qualifying: boolean (true if child food, nursery formula, diapers, kids clothing, school supplies, pediatric medicine, kids hygiene; false if adult personal items such as coffee beans, alcohol, cosmetics, adult snacks)
- suggested_category: One of ['School & Education', 'Medical Aid / Doctor', 'Rent / Child Room', 'Fuel / Transport', 'Extramural / Sports', 'Clothing & Essentials', 'Nutrition & Hygiene', 'Other']
- exclusion_reason: String explaining why it is excluded if is_child_qualifying is false, otherwise null.

Respond ONLY with valid JSON in this structure:
{
  "vendor": string,
  "invoice_date": string,
  "receipt_number": string,
  "gross_total": number,
  "currency": "ZAR",
  "ocr_confidence": number,
  "items": [
    {
      "item_name": string,
      "quantity": number,
      "unit_price": number,
      "line_total": number,
      "is_child_qualifying": boolean,
      "suggested_category": string,
      "exclusion_reason": string | null
    }
  ]
}`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: cleanBase64,
                },
              },
            ],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.1,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", errText);
      return NextResponse.json(
        { error: "Gemini OCR request failed", details: errText },
        { status: 502 }
      );
    }

    const geminiData = await response.json();
    const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json({ error: "No response text from Gemini" }, { status: 500 });
    }

    const parsedJson = JSON.parse(candidateText);

    return NextResponse.json({
      success: true,
      source: "gemini-2.5-flash",
      data: parsedJson,
    });
  } catch (error: any) {
    console.error("OCR API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process receipt with Gemini OCR" },
      { status: 500 }
    );
  }
}
