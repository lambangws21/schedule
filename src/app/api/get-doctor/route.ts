import { NextRequest, NextResponse } from "next/server";

const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx5lkScn9EOrS9tyhA6e0jkUPbwtTW89Bi4fTAzU-OcCdd2MlrHeFUVfUEq1Xufzt4j/exec?action=getDoctors";

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
