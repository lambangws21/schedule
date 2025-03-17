import { NextResponse } from 'next/server';

const GAS_URL = process.env.OPERASI_URL || "";
const FOLDER_ID = '1SREBKZ9SXqLptXVRiaqWHzD1x13waV9I';

// ✅ GET: Ambil data dari Sheet1
export async function GET() {
    try {
        const response = await fetch(GAS_URL, { method: 'GET', cache: 'no-store' });
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error GET:', error);
        return NextResponse.json({ status: 'error', message: String(error) });
    }
}

// ✅ POST: Tambah Data Baru + Upload File
export async function POST(req: Request) {
    try {
        const {
            date,
            namaPasien,
            nomorRekamMedis,
            namaDokter,
            jenisBius,
            jaminanOperasi,
            tindakanOperasi,
            teamOperasi,
            ruangOperasi,
            fileBase64,
            fileName,
            mimeType,
        } = await req.json();

        const response = await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date,
                namaPasien,
                nomorRekamMedis,
                namaDokter,
                jenisBius,
                jaminanOperasi,
                tindakanOperasi,
                teamOperasi,
                ruangOperasi,
                fileName,
                fileBase64,
                mimeType,
                folderId: FOLDER_ID,
            }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error POST:', error);
        return NextResponse.json({ status: 'error', message: String(error) });
    }
}

// ✅ PUT: Update Data yang Sudah Ada
export async function PUT(req: Request) {
    try {
        const body = await req.json();

        const response = await fetch(GAS_URL, {
            method: 'POST', // Apps Script tidak native mendukung PUT
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                methodOverride: 'PUT', // Trik method override
                ...body,
            }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error PUT:', error);
        return NextResponse.json({ status: 'error', message: String(error) });
    }
}

// ✅ DELETE: Hapus Data Berdasarkan NO
export async function DELETE(req: Request) {
    try {
        const { no } = await req.json();

        const response = await fetch(GAS_URL, {
            method: 'POST', // Apps Script tidak native mendukung DELETE
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                methodOverride: 'DELETE',
                no,
            }),
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error DELETE:', error);
        return NextResponse.json({ status: 'error', message: String(error) });
    }
}
