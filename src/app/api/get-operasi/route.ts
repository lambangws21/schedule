import { NextResponse } from 'next/server';

const OPERASI_URL = process.env.OPERASI_URL || "";

// ✅ GET: Ambil data hanya dari Sheet1
export async function GET() {
  try {
    const response = await fetch(OPERASI_URL, { method: 'GET', cache: 'no-store' });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ status: 'error', message: String(error) });
  }
}
