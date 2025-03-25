"use client";

import { useState } from "react";
import InputField from "../ui/InputField";
import AnimatedSelect from "../ui/AnimatedSelect";

export default function FormInputDokter() {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
  const [role, setRole] = useState("Dokter"); // opsi: Dokter atau Perawat
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!file) {
      setMessage("Silakan pilih gambar.");
      setLoading(false);
      return;
    }

    // Konversi file ke base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = (reader.result as string).split(",")[1];

      // Pastikan key yang dikirim sesuai dengan header di sheet
      const payload =
        role === "Dokter"
          ? {
              targetSheet: "Sheet5", // Sheet5 untuk Dokter
              "Data Dokter": name,
              spesialis: profile, // gunakan huruf kecil sesuai header
              base64Image,
            }
          : {
              targetSheet: "Sheet6", // Sheet6 untuk Perawat
              "Data Perawat": name,
              spesialis: profile, // gunakan huruf kecil sesuai header
              base64Image,
            };

      try {
        const res = await fetch("/api/dataDokter/dokter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.success) {
          setMessage("✅ Data berhasil ditambahkan!");
          setName("");
          setProfile("");
          setFile(null);
        } else {
          setMessage("❌ Gagal menambahkan data.");
        }
      } catch (error) {
        setMessage("❌ Error saat mengirim data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 bg-slate-900 rounded-lg shadow-md max-w-xl mx-auto space-y-4 border"
    >
      <h2 className="text-xl font-bold text-white mb-2">Tambah Data Staff</h2>

      <div>
        <InputField 
          label="Nama"
          type="text"
          name="name"
          placeholder="Masukkan Nama"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        {/* Perbaiki: gunakan setProfile, bukan setName */}
        <InputField 
          label="Profil Singkat"
          type="text"
          name="profilSingkat"
          placeholder="Masukkan Profil Singkat"
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          required
        />
      </div>

      <div>
        <AnimatedSelect
          id="role"
          label="Pilih Tipe"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            { label: "Dokter", value: "Dokter" },
            { label: "Perawat", value: "Perawat" },
          ]}
        />
      </div>

      <div>
        <label className="text-white block mb-1">Foto</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full text-white"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
      >
        {loading ? "Menyimpan..." : "Simpan Data"}
      </button>

      {message && (
        <p
          className={`mt-3 text-sm font-medium ${
            message.includes("✅") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
