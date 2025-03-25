import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const response = await fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan!" }, { status: 500 });
  }
}
