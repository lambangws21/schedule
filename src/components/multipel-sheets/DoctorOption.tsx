"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { XCircle } from "lucide-react";
import InputField from "../ui/InputField";


export default function Form({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    date: "",
    namaPasien: "",
    nomorRekamMedis: "",
    namaDokter: "",
    jenisBius: "",
    jaminanOperasi: "",
    tindakanOperasi: "",
    teamOperasi: "",
    ruangOperasi: "",
    sheet: "Sheet1", // Default ke Sheet1
  });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState<string[]>([]);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const res = await fetch("/api/getDoctors");
        const data = await res.json();
        
        // Pastikan data yang diambil adalah array dan hanya mengambil nama dokter
        if (Array.isArray(data)) {
          setDoctors(data.map((doctor) => doctor.name)); 
        }
      } catch (error) {
        console.error("Gagal mengambil data dokter:", error);
      }
    }
    fetchDoctors();
  }, []);
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let fileBase64 = "";
      let fileName = "";
      let mimeType = "";

      if (file) {
        fileName = file.name;
        mimeType = file.type;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        await new Promise((resolve) => {
          reader.onload = () => {
            fileBase64 = reader.result?.toString().split(",")[1] || "";
            resolve(null);
          };
        });
      }

      const payload = {
        targetSheet: formData.sheet,
        date: formData.date,
        namaPasien: formData.namaPasien,
        nomorRekamMedis: formData.nomorRekamMedis,
        namaDokter: formData.namaDokter,
        jenisBius: formData.jenisBius,
        jaminanOperasi: formData.jaminanOperasi,
        tindakanOperasi: formData.tindakanOperasi,
        teamOperasi: formData.teamOperasi,
        ruangOperasi: formData.ruangOperasi,
        fileBase64: fileBase64 || null,
        fileName: fileName || null,
        mimeType: mimeType || null,
      };

      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch {
      setMessage("Terjadi kesalahan saat menambahkan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="p-4 bg-slate-800 border rounded-lg shadow-lg w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-600">Tambah Data</h2>
          <div onClick={onClose} className=" rounded-full hover:bg-red-200">
            <XCircle className="w-6 h-6 text-red-400 hover:cursor-pointer" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            name="sheet"
            value={formData.sheet}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          >
            <option value="Sheet1">Sheet 1</option>
            <option value="Sheet2">Sheet 2</option>
            <option value="Sheet3">Sheet 3</option>
            <option value="Sheet4">Sheet 4</option>
            <option value="Sheet5">Sheet 5</option>
          </select>
          <InputField
            label="Tanggal Operasi"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <InputField
            label="Nama Pasien"
            name="namaPasien"
            placeholder="Nama Pasien"
            value={formData.namaPasien}
            onChange={handleChange}
            required
          />

          <InputField
            label="Nomor Rekam Medis"
            name="nomorRekamMedis"
            placeholder="Nomor Rekam Medis"
            value={formData.nomorRekamMedis}
            onChange={handleChange}
            required
          />
          <div>
            <label className="block text-sm font-medium">Pilih Dokter:</label>
            <select
              value={selectedDoctor}
              onChange={(e) => {
                setSelectedDoctor(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  namaDokter: e.target.value, // Memperbarui namaDokter di formData
                }));
              }}
              className="w-full p-2 border rounded"
            >
              <option value="" disabled>
                Pilih dokter
              </option>
              {doctors.map((doctor, index) => (
                <option key={index} value={doctor}>
                  {doctor}
                </option>
              ))}
            </select>
          </div>
          <InputField
            label="Jenis Pembiusan"
            name="jenisBius"
            placeholder="Jenis Pembiusan"
            value={formData.jenisBius}
            onChange={handleChange}
            required
          />
          <InputField
            label="Jaminan Operasi"
            name="jaminanOperasi"
            placeholder="Jaminan Operasi"
            value={formData.jaminanOperasi}
            onChange={handleChange}
            required
          />
          <InputField
            label="Tindakan Operasi"
            name="tindakanOperasi"
            placeholder="Tindakan Operasi"
            value={formData.tindakanOperasi}
            onChange={handleChange}
            required
          />
          <InputField
            label="Team Operasi"
            name="teamOperasi"
            placeholder="Team Operasi"
            value={formData.teamOperasi}
            onChange={handleChange}
            required
          />
          <InputField
            label="Ruang Operasi"
            name="ruangOperasi"
            placeholder="Ruang Operasi"
            value={formData.ruangOperasi}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white p-2"
          >
            {loading ? "Menambahkan..." : "Tambah Data"}
          </Button>
        </form>

        {message && <p className="text-sm text-red-500">{message}</p>}
      </motion.div>
    </AnimatePresence>
  );
}
