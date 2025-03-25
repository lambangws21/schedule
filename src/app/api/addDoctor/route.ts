import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const response = await fetch("https://script.google.com/macros/s/AKfycbz5Z6rrtL1kcw-5Z-Rjcu19PvB5PNmlRuHJdlLymspCNQ1Fs5NED-l7FT27Fqyb0qGP/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch  {
    return NextResponse.json({ error: "Terjadi kesalahan!" }, { status: 500 });
  }
}
