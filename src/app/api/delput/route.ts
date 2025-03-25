import { NextResponse } from 'next/server';

const GAS_URL = process.env.OPERASI_URL || "";

// ✅ UPDATE (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(GAS_URL, {
      method: 'POST', // Google Apps Script hanya mendukung GET & POST
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ methodOverride: 'PUT', ...body }),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Unexpected response (PUT):', textResponse);
      return NextResponse.json({ status: 'error', message: 'API tidak mengembalikan JSON' });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error PUT:', error);
    return NextResponse.json({ status: 'error', message: String(error) });
  }
}

// ✅ DELETE
export async function DELETE(req: Request) {
  try {
    const { no } = await req.json();

    const response = await fetch(GAS_URL, {
      method: 'POST', // Google Apps Script hanya mendukung GET & POST
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ methodOverride: 'DELETE', no }),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Unexpected response (DELETE):', textResponse);
      return NextResponse.json({ status: 'error', message: 'API tidak mengembalikan JSON' });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error DELETE:', error);
    return NextResponse.json({ status: 'error', message: String(error) });
  }
}
