import { NextRequest, NextResponse } from "next/server";

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz5Z6rrtL1kcw-5Z-Rjcu19PvB5PNmlRuHJdlLymspCNQ1Fs5NED-l7FT27Fqyb0qGP/exec";

export async function GET() {
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: "error", message: error }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: "error", message: error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    body.methodOverride = "PUT";

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: "error", message: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    body.methodOverride = "DELETE";

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: "error", message: error }, { status: 500 });
  }
}
