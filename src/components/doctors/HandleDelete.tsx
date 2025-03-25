"use client";
import React, { useState, useEffect } from "react";
import { OperationRecord } from "@/types/mobile";

// Definisikan tipe data untuk record (bisa disamakan dengan OperationRecord jika sama)
interface DoctorRecord {
  no: number;
  date: string;
  namaPasien: string;
  nomorRekamMedis: string;
  namaDokter: string;
  jenisBius: string;
  jaminanOperasi: string;
  tindakanOperasi: string;
  teamOperasi: string;
  ruangOperasi: string;
  status: string;
}

const HandleDelete: React.FC = () => {
  const [records, setRecords] = useState<DoctorRecord[]>([]);
  // Tambahkan state untuk sheet yang dipilih (misalnya default "Sheet1")
  const [selectedSheet, setSelectedSheet] = useState("Sheet1");

  // Fungsi untuk mengambil data dari API
  const fetchRecords = async () => {
    try {
      const res = await fetch("/api/dataDokter/dokter");
      const data = await res.json();
      // Asumsikan data API berada pada data.data.Sheet1 atau langsung berupa array
      if (data.data && data.data[selectedSheet]) {
        setRecords(data.data[selectedSheet]);
      } else if (Array.isArray(data)) {
        setRecords(data);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedSheet]);

  // Fungsi untuk menghapus record dengan methodOverride DELETE
  const handleDelete = async (record: OperationRecord) => {
    if (confirm(`Apakah Anda yakin akan menghapus record no ${record.no}?`)) {
      try {
        const res = await fetch("/api/dataDokter/delput", {
          method: "POST", // Gunakan POST karena GAS hanya mendukung GET & POST
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            methodOverride: "DELETE", // Sertakan methodOverride
            no: record.no,
            targetSheet: selectedSheet,
          }),
        });
        const result = await res.json();
        if (result.success) {
          alert(`Record no ${record.no} berhasil dihapus.`);
          fetchRecords(); // Refresh data dengan fetchRecords()
        } else {
          alert(`Gagal menghapus: ${result.error}`);
        }
      } catch (error) {
        console.error("Error deleting record:", error);
        alert("Error deleting record");
      }
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Daftar Data Dokter</h1>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>No</th>
            <th>Date</th>
            <th>Nama Pasien</th>
            <th>Nomor Rekam Medis</th>
            <th>Nama Dokter</th>
            <th>Jenis Bius</th>
            <th>Jaminan Operasi</th>
            <th>Tindakan Operasi</th>
            <th>Team Operasi</th>
            <th>Ruang Operasi</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {records.length > 0 ? (
            records.map((record) => (
              <tr key={record.no}>
                <td>{record.no}</td>
                <td>{record.date}</td>
                <td>{record.namaPasien}</td>
                <td>{record.nomorRekamMedis}</td>
                <td>{record.namaDokter}</td>
                <td>{record.jenisBius}</td>
                <td>{record.jaminanOperasi}</td>
                <td>{record.tindakanOperasi}</td>
                <td>{record.teamOperasi}</td>
                <td>{record.ruangOperasi}</td>
                <td>{record.status}</td>
                <td>
                  <button onClick={() => handleDelete(record)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={12}>Tidak ada data.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HandleDelete;
