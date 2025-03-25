"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputField from "../ui/InputField";
import AnimatedSelect from "../ui/AnimatedSelect";

interface DoctorOption {
  id: number;
  name: string;
}

interface OperationFormData {
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

interface StaffItem {
  ID: number;
  "Data Dokter"?: string;
  "Data Perawat"?: string;
  spesialis?: string;
  GoogleDriveID?: string;
  imageUrl?: string;
  role?: string;
}

export default function OperationForm() {
  // State untuk menentukan sheet mana yang dipilih (OR1, OR2, dsb.)
  const [targetSheet, setTargetSheet] = useState<string>("");

  // State untuk form data operasi
  const [formData, setFormData] = useState<OperationFormData>({
    date: "",
    namaPasien: "",
    nomorRekamMedis: "",
    namaDokter: "",
    jenisBius: "",
    jaminanOperasi: "",
    tindakanOperasi: "",
    teamOperasi: "",
    ruangOperasi: "",
    status: "pending",
  });

  // Data dokter untuk <select>
  const [doctorOptions, setDoctorOptions] = useState<DoctorOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");

  // Ambil data dokter dari API untuk mengisi select option
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/dataDokter/getImages?getImages=true");
        const data: StaffItem[] = await res.json();
        if (Array.isArray(data)) {
          // Filter data yang berasal dari dokter
          const doctors = data.filter(
            (item: StaffItem) =>
              item.role === "dokter" || item["Data Dokter"] !== undefined
          );
          const options: DoctorOption[] = doctors.map((doc: StaffItem) => ({
            id: doc.ID,
            name: doc["Data Dokter"] ? doc["Data Dokter"] : "",
          }));
          setDoctorOptions(options);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  // Tangani perubahan pada input field
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Submit form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage("");

    // Pastikan field namaDokter telah dipilih
    if (!formData.namaDokter) {
      toast.error("Silakan pilih dokter dari daftar.");
      setIsSubmitting(false);
      return;
    }

    // Pastikan targetSheet terisi (pilih OR)
    if (!targetSheet) {
      toast.error("Silakan pilih ruang operasi (OR).");
      setIsSubmitting(false);
      return;
    }

    // Gabungkan targetSheet + formData
    const payload = {
      targetSheet,
      ...formData,
    };

    try {
      const res = await fetch("/api/dataDokter/dokter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        toast.success("Data operasi berhasil disimpan.");
        setResponseMessage("Data operasi berhasil disimpan.");
      } else {
        toast.error("Error: " + (data.error || "Terjadi kesalahan"));
        setResponseMessage("Error: " + (data.error || "Terjadi kesalahan"));
      }
    } catch {
      setIsSubmitting(false);
      toast.error("Terjadi kesalahan saat menyimpan data");
      setResponseMessage("Terjadi kesalahan saat menyimpan data");
    }
  };

  return (
    <div className="max-w-xl bg-slate-900 mx-auto border rounded-lg p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Form Data Operasi</h2>
      <form onSubmit={handleSubmit}>
        {/* AnimatedSelect untuk memilih Ruang Operasi (sheet) */}
        <AnimatedSelect
          label="Ruang Operasi"
          id="targetSheet"
          value={targetSheet}
          onChange={(e) => setTargetSheet(e.target.value)}
          options={[
            { label: "Pilih Ruang Operasi", value: "" },
            { label: "OR1", value: "Sheet1" },
            { label: "OR2", value: "Sheet2" },
            { label: "OR3", value: "Sheet3" },
            { label: "OR4", value: "Sheet4" },
          ]}
        />

        {/* Date */}
        <div className="mb-4">
          <InputField
            label="Date"
            name="date"
            type="date"
            placeholder="Tanggal Operasi"
            value={formData.date}
            onChange={handleChange}
            required
            id="date"
          />
        </div>

        {/* Nama Pasien */}
        <div className="mb-4">
          <InputField
            label="Nama Pasien"
            name="namaPasien"
            placeholder="Nama Pasien"
            value={formData.namaPasien}
            onChange={handleChange}
            required
            id="namaPasien"
          />
        </div>

        {/* No Rekam Medis */}
        <div className="mb-4">
          <InputField
            label="No Rekam Medis"
            name="nomorRekamMedis"
            placeholder="No Rekam Medis"
            value={formData.nomorRekamMedis}
            onChange={handleChange}
            required
            id="nomorRekamMedis"
          />
        </div>

        {/* Nama Dokter (select) */}
        <div className="mb-4">
          <label htmlFor="namaDokter" className="block font-semibold mb-1 text-gray-200">
            Nama Dokter
          </label>
          <select
            id="namaDokter"
            value={formData.namaDokter}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Pilih Dokter</option>
            {doctorOptions.map((option) => (
              <option key={option.id} value={option.name}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Jenis Bius */}
        <div className="mb-4">
          <InputField
            label="Jenis Bius"
            name="jenisBius"
            placeholder="Jenis Bius"
            value={formData.jenisBius}
            onChange={handleChange}
            required
            id="jenisBius"
          />
        </div>

        {/* Jaminan Operasi */}
        <div className="mb-4">
          <InputField
            label="Jaminan Pasien"
            name="jaminanOperasi"
            placeholder="Jaminan Operasi"
            value={formData.jaminanOperasi}
            onChange={handleChange}
            required
            id="jaminanOperasi"
          />
        </div>

        {/* Tindakan Operasi */}
        <div className="mb-4">
          <InputField
            label="Tindakan Operasi"
            name="tindakanOperasi"
            placeholder="Tindakan Operasi"
            value={formData.tindakanOperasi}
            onChange={handleChange}
            required
            id="tindakanOperasi"
          />
        </div>

        {/* Team Operasi */}
        <div className="mb-4">
          <InputField
            label="Team Operasi"
            name="teamOperasi"
            placeholder="Team Operasi"
            value={formData.teamOperasi}
            onChange={handleChange}
            required
            id="teamOperasi"
          />
        </div>

        {/* Ruang Operasi (nama ruangan) */}
        <div className="mb-4">
          <InputField
            label="Nama Ruangan"
            name="ruangOperasi"
            placeholder="Ruang Operasi"
            value={formData.ruangOperasi}
            onChange={handleChange}
            required
            id="ruangOperasi"
          />
        </div>

        {/* AnimatedSelect untuk Status Operasi */}
        <AnimatedSelect
          label="Status Operasi"
          id="status"
          value={formData.status}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, status: e.target.value }))
          }
          options={[
            { label: "Pending", value: "pending" },
            { label: "Berjalan", value: "berjalan" },
            { label: "Selesai", value: "selesai" },
            { label: "Batal", value: "batal" },
          ]}
        />

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center mt-4"
        >
          {isSubmitting && (
            <div className="w-4 h-4 border-4 border-t-transparent border-blue-500 animate-spin mr-2"></div>
          )}
          {isSubmitting ? "Submitting..." : "Submit Operasi"}
        </button>
      </form>

      {/* Pesan Respons */}
      {responseMessage && <p className="mt-4 text-gray-200">{responseMessage}</p>}
    </div>
  );
}
