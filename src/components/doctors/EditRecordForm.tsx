"use client";

import React, { useState } from "react";
import { OperationRecord } from "@/types/mobile";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS untuk toast

interface EditRecordFormProps {
  record: OperationRecord;
  targetSheet: string;
  onUpdate: () => void;
  onClose: () => void;
}

const EditRecordForm: React.FC<EditRecordFormProps> = ({
  record,
  targetSheet,
  onUpdate,
  onClose,
}) => {
  const [formData, setFormData] = useState<OperationRecord>(record);
  const [loading, setLoading] = useState(false); // State untuk loading

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); // Mulai loading

    try {
      // Gunakan POST dengan methodOverride "PUT"
      const res = await fetch("/api/dataDokter/dokter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          methodOverride: "PUT",
          targetSheet,
          ...formData,
        }),
      });
      const result = await res.json();
      setLoading(false); // Selesai loading

      if (result.success) {
        toast.success(`Record no ${formData.no} berhasil diperbarui.`); // Toast sukses
        onUpdate();
        onClose();
      } else {
        toast.error(`Gagal update: ${result.error}`); // Toast error
      }
    } catch (error) {
      setLoading(false); // Selesai loading jika ada error
      console.error("Error updating record:", error);
      toast.error("Error updating record"); // Toast error
    }
  };

  return (
    <div className="p-4 border rounded bg-slate-900 shadow-md">
      <h2 className="text-xl font-semibold mb-4">Edit Record</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block mb-1">Date:</label>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border p-1 w-full"
            placeholder="YYYY-MM-DD"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Nama Pasien:</label>
          <input
            type="text"
            name="namaPasien"
            value={formData.namaPasien}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Nomor Rekam Medis:</label>
          <input
            type="text"
            name="nomorRekamMedis"
            value={formData.nomorRekamMedis}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Nama Dokter:</label>
          <input
            type="text"
            name="namaDokter"
            value={formData.namaDokter}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Jenis Bius:</label>
          <input
            type="text"
            name="jenisBius"
            value={formData.jenisBius}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Jaminan Operasi:</label>
          <input
            type="text"
            name="jaminanOperasi"
            value={formData.jaminanOperasi}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Tindakan Operasi:</label>
          <input
            type="text"
            name="tindakanOperasi"
            value={formData.tindakanOperasi}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Team Operasi:</label>
          <input
            type="text"
            name="teamOperasi"
            value={formData.teamOperasi}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block mb-1">Ruang Operasi:</label>
          <input
            type="text"
            name="ruangOperasi"
            value={formData.ruangOperasi}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Status:</label>
          <input
            type="text"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-1 w-full"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2"
            disabled={loading} // Menonaktifkan tombol jika loading
          >
            {loading ? "Menyimpan..." : "Simpan"} {/* Menampilkan teks loading */}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRecordForm;
