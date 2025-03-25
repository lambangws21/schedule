"use client";

import { useState } from "react";

export default function FormInputDokter() {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
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

      const payload = {
        name,
        profile,
        base64Image,
      };

      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbx5lkScn9EOrS9tyhA6e0jkUPbwtTW89Bi4fTAzU-OcCdd2MlrHeFUVfUEq1Xufzt4j/exec",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();

        if (data.success) {
          setMessage("✅ Dokter berhasil ditambahkan!");
          setName("");
          setProfile("");
          setFile(null);
        } else {
          setMessage("❌ Gagal menambahkan dokter.");
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
      className="p-6 bg-slate-900 rounded-lg shadow-md max-w-xl mx-auto space-y-4"
    >
      <h2 className="text-xl font-bold text-white mb-2">Tambah Dokter</h2>

      <div>
        <label className="text-white block mb-1">Nama Dokter</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
          required
        />
      </div>

      <div>
        <label className="text-white block mb-1">Profil Singkat</label>
        <textarea
          value={profile}
          onChange={(e) => setProfile(e.target.value)}
          className="w-full p-2 rounded bg-slate-800 text-white border border-slate-700"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="text-white block mb-1">Foto Dokter</label>
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
        {loading ? "Menyimpan..." : "Simpan Dokter"}
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
