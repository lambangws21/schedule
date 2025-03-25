"use client";

import { useState } from "react";

export default function StaffForm() {
  const [targetSheet, setTargetSheet] = useState("Sheet5");
  const [staffData, setStaffData] = useState({
    nama: "",
    profile: "",
    base64Image: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  // Mengubah file input menjadi base64 string
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Jika diperlukan, pisahkan header data URI dengan split(",")
      const base64Result = result.split(",")[1];
      setStaffData((prev) => ({ ...prev, base64Image: base64Result }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setStaffData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseMessage("");

    const payload = {
      targetSheet, // Expected "Sheet5" atau "Sheet6"
      ...staffData,
    };

    try {
      const res = await fetch("https://script.google.com/macros/s/AKfycbz5Z6rrtL1kcw-5Z-Rjcu19PvB5PNmlRuHJdlLymspCNQ1Fs5NED-l7FT27Fqyb0qGP/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setResponseMessage("Data staf berhasil disimpan.");
      } else {
        setResponseMessage("Error: " + (data.error || "Terjadi kesalahan"));
      }
    } catch  {
      setResponseMessage("Error: " + "Terjadi kesalahan saat menyimpan data");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded shadow-sm">
      <h2 className="text-2xl font-bold mb-4">Form Data Staf</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="targetSheet" className="block font-semibold mb-1">
            Target Sheet Staf
          </label>
          <select
            id="targetSheet"
            value={targetSheet}
            onChange={(e) => setTargetSheet(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Sheet5">Dokter</option>
            <option value="Sheet6">Perawat</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="nama" className="block font-semibold mb-1">
            Nama
          </label>
          <input
            type="text"
            id="nama"
            value={staffData.nama}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="profile" className="block font-semibold mb-1">
            Profile
          </label>
          <input
            type="text"
            id="profile"
            value={staffData.profile}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block font-semibold mb-1">
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {isSubmitting ? "Submitting..." : "Submit Staf"}
        </button>
      </form>
      {responseMessage && <p className="mt-4">{responseMessage}</p>}
    </div>
  );
}
