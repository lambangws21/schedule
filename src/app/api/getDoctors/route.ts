import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbx5lkScn9EOrS9tyhA6e0jkUPbwtTW89Bi4fTAzU-OcCdd2MlrHeFUVfUEq1Xufzt4j/exec?action=getDoctors");
    if (!response.ok) throw new Error("Gagal mengambil data");

    const data = await response.json();
    return NextResponse.json(data);
  } catch  {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}
