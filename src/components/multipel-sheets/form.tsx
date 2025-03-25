"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type PatientData = {
  no: string;
  date: string;
  namaPasien: string;
  tindakanOperasi: string;
};

const API_URL = "https://script.google.com/macros/s/AKfycbx5lkScn9EOrS9tyhA6e0jkUPbwtTW89Bi4fTAzU-OcCdd2MlrHeFUVfUEq1Xufzt4j/exec fb";

export default function DataTable() {
  const [data, setData] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<PatientData>({ no: "", date: "", namaPasien: "", tindakanOperasi: "" });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    setLoading(true);
    const res = await fetch(API_URL);
    const result = await res.json();
    setData(result.data.Sheet1);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    setForm({ no: "", date: "", namaPasien: "", tindakanOperasi: "" });
    setLoading(false);
    fetchData();
  };

  const handleEdit = (item: PatientData): void => {
    setForm(item);
    setIsEditing(true);
  };

  const handleUpdate = async (): Promise<void> => {
    setLoading(true);
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, methodOverride: "PUT" }),
    });
    setLoading(false);
    setIsEditing(false);
    fetchData();
  };

  const handleDelete = async (no: string): Promise<void> => {
    setLoading(true);
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ no, methodOverride: "DELETE" }),
    });
    setLoading(false);
    fetchData();
  };

  return (
    <div className="p-4">
      <motion.h1 className="text-xl font-bold mb-4" animate={{ opacity: [0, 1] }}>
        Data Pasien
      </motion.h1>

      <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="mb-4">
        <input type="text" placeholder="No" value={form.no} onChange={(e) => setForm({ ...form, no: e.target.value })} className="border p-2 mr-2" required />
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="border p-2 mr-2" required />
        <input type="text" placeholder="Nama Pasien" value={form.namaPasien} onChange={(e) => setForm({ ...form, namaPasien: e.target.value })} className="border p-2 mr-2" required />
        <input type="text" placeholder="Tindakan" value={form.tindakanOperasi} onChange={(e) => setForm({ ...form, tindakanOperasi: e.target.value })} className="border p-2 mr-2" required />
        <button type="submit" className="bg-blue-500 text-white p-2">
          {loading ? "Loading..." : isEditing ? "Update" : "Tambah"}
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">No</th>
            <th className="border p-2">Tanggal</th>
            <th className="border p-2">Nama Pasien</th>
            <th className="border p-2">Tindakan</th>
            <th className="border p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} className="text-center p-4">Loading...</td></tr>
          ) : (
            data.map((item) => (
              <motion.tr key={item.no} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <td className="border p-2">{item.no}</td>
                <td className="border p-2">{item.date}</td>
                <td className="border p-2">{item.namaPasien}</td>
                <td className="border p-2">{item.tindakanOperasi}</td>
                <td className="border p-2">
                  <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white p-1 mr-2">Edit</button>
                  <button onClick={() => handleDelete(item.no)} className="bg-red-500 text-white p-1">Delete</button>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}