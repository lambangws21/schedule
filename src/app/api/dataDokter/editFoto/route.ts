import { NextResponse } from "next/server";

const APPSCRIPT_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwYlfT_3JoZ2UeF8CAlIHLH0hrFCeR1HDXIOdAvneLJjJAv9f_TCZI-46hgy1cPRs4DoQ/exec";

// GET: Ambil data, misalnya dengan parameter getImages=true untuk Sheet5/Sheet6
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const endpointURL =
      APPSCRIPT_ENDPOINT + (queryString ? "?" + queryString : "");
    const res = await fetch(endpointURL);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// POST: Untuk create record
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(APPSCRIPT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// PUT: Untuk update record, tambahkan properti methodOverride: "PUT"
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(APPSCRIPT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, methodOverride: "PUT" }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}

// DELETE: Untuk delete record, tambahkan properti methodOverride: "DELETE"
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(APPSCRIPT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, methodOverride: "DELETE" }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
