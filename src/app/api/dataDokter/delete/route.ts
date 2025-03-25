import { NextResponse, NextRequest } from "next/server";

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbwYlfT_3JoZ2UeF8CAlIHLH0hrFCeR1HDXIOdAvneLJjJAv9f_TCZI-46hgy1cPRs4DoQ/exec";

// DELETE endpoint untuk menghapus record
export async function DELETE(req: NextRequest) {
  try {
    // Baca body dari request
    const body = await req.json();

    // Tambahkan properti methodOverride = "DELETE"
    // karena Google Apps Script hanya mendukung GET & POST
    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        methodOverride: "DELETE",
      }),
    });

    // Gas seringkali mengembalikan string (bukan JSON murni),
    // jadi kita ambil via response.text()
    const text = await response.text();

    // Coba parse JSON
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      // Jika gagal parse, kita bisa tangani error atau default
      console.error("Gagal parse respons dari GAS:", err);
      data = { success: false, error: "Invalid JSON from GAS" };
    }

    // Jika data tidak punya properti success, Anda bisa menambahkannya manual
    // atau menganggap success = true jika tidak ada error.
    if (!("success" in data)) {
      // Misalnya, kita asumsikan success = true
      data.success = true;
    }

    // Kembalikan data ke klien
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in DELETE route:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
