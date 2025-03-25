import { NextResponse } from 'next/server';

const OPERASI_URL = process.env.OPERASI_URL || "https://script.google.com/macros/s/AKfycbyHEieqYlAZBt1LiJMSo6V6lsIzCpHirkwfaB5Dqp4PX9mPzGtOK8lGsIBP5Ec6Kxv7/exec";

export async function GET() {
  try {
    if (!OPERASI_URL) {
      return NextResponse.json({ status: 'error', message: 'OPERASI_URL is not set' });
    }

    const response = await fetch(OPERASI_URL, { method: 'GET', cache: 'no-store' });

    console.log("Response Status:", response.status);
    const text = await response.text();
    // console.log("Response Text:", text);

    if (!response.ok) {
      return NextResponse.json({ status: 'error', message: `Failed to fetch data: ${response.statusText}` });
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch  {
      return NextResponse.json({ status: 'error', message: 'Invalid JSON response' });
    }
  } catch (error) {
    return NextResponse.json({ status: 'error', message: String(error) });
  }
}
