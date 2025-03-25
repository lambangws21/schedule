'use client';
import { CircleX, LoaderCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface EditFormProps {
  editData: DataRow | null;
  onClose: () => void;
  onUpdate: () => void;
}

interface DataRow {
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

export default function EditForm({ editData, onClose, onUpdate }: EditFormProps) {
  const [formData, setFormData] = useState<DataRow | null>(editData);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setFormData(editData);
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsUpdating(true);

    try {
      const res = await fetch('/api/delput', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.status === 'success') {
        toast.success(`✅ Data berhasil diperbarui!`);
        onUpdate();
        setTimeout(() => {
          onClose(); // Menutup form setelah sukses
        }, 500);
      } else {
        toast.error(`❌ Gagal: ${data.message}`);
      }
    } catch  {
      toast.error(`⚠️ Terjadi kesalahan saat mengupdate data`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={6000} />

      {formData && (
        <div className="fixed inset-0 bg-slate-900/10 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-slate-700 p-6 rounded-lg shadow-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4 text-slate-50"> Edit Data</h2>
            <button
              onClick={!isUpdating ? onClose : undefined} 
              className="absolute top-2 right-2 text-gray-200 hover:text-red-500"
              disabled={isUpdating}
            >
              <CircleX />
            </button>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-100" required />
              <input type="text" name="namaPasien" value={formData.namaPasien} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-100" required />
              <input type="text" name="nomorRekamMedis" value={formData.nomorRekamMedis} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-100" required />
              <input type="text" name="namaDokter" value={formData.namaDokter} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-100" required />
              <input type="text" name="jenisBius" value={formData.jenisBius} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-100" required />
              <input type="text" name="jaminanOperasi" value={formData.jaminanOperasi} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-100" required />
              <input type="text" name="tindakanOperasi" value={formData.tindakanOperasi} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-100" required />
              <input type="text" name="teamOperasi" value={formData.teamOperasi} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-100" required />
              <input type="text" name="ruangOperasi" value={formData.ruangOperasi} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-100" required />
              <input type="text" name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-100" required />
              
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition" disabled={isUpdating}>
                {isUpdating ? 'Mengupdate...' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 Full-Screen Loading Overlay */}
      {isUpdating && (
        <div className="fixed inset-0 bg-slate-300 bg-opacity-70 flex justify-center items-center z-50">
          <LoaderCircle className="animate-spin w-16 h-16 text-white" />
        </div>
      )}
    </>
  );
}
