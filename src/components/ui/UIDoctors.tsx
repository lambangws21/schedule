"use client";

import { useState } from "react";

export default function DoctorForm() {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !profile || !image) {
      setMessage("Semua field harus diisi!");
      return;
    }

    setLoading(true);
    setMessage("");

    // Convert image to base64
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async () => {
      const base64String = reader.result?.toString().split(",")[1]; // Remove header

      try {
        const response = await fetch("https://script.google.com/macros/s/AKfycbz5Z6rrtL1kcw-5Z-Rjcu19PvB5PNmlRuHJdlLymspCNQ1Fs5NED-l7FT27Fqyb0qGP/exec", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            profile,
            base64Image: base64String,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setMessage("Data berhasil ditambahkan!");
          setName("");
          setProfile("");
          setImage(null);
        } else {
          setMessage("Gagal menyimpan data: " + data.error);
        }
      } catch  {
        setMessage("Terjadi kesalahan, coba lagi!");
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <div className="max-w-md mx-auto bg-slate-500 p-6 shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">Tambah Data Dokter</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium">Nama Dokter</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Profil</label>
          <input
            type="text"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Upload Foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Simpan"}
        </button>
        {message && <p className="mt-2 text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
}
