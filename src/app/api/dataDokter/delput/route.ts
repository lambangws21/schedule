
import { NextResponse, NextRequest } from "next/server";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwYlfT_3JoZ2UeF8CAlIHLH0hrFCeR1HDXIOdAvneLJjJAv9f_TCZI-46hgy1cPRs4DoQ/exec";

// PUT endpoint untuk update record
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.targetSheet) {
      return NextResponse.json({ error: "Target sheet not specified" }, { status: 400 });
    }

    // Kirim permintaan ke Apps Script dengan methodOverride "PUT"
    const response = await fetch(GAS_URL, {
      method: "POST", // GAS hanya mendukung GET & POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ methodOverride: "PUT", ...body }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Unexpected response (PUT):", textResponse);
      return NextResponse.json({ error: "API did not return JSON" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in PUT:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// DELETE endpoint untuk menghapus record
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Handle DELETE override
    if (body.methodOverride === "DELETE") {
      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await response.text(); // Gas kadang balikin string
      return NextResponse.json(text ? JSON.parse(text) : {});
    }

    // handle POST biasa di sini jika ada
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 });
  }
}

