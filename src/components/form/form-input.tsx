'use client';
import { CircleX, LoaderCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormDataType {
  id?: string;
  date: string;
  namaPasien: string;
  nomorRekamMedis: string;
  namaDokter: string;
  jenisBius: string;
  jaminanOperasi:string;
  tindakanOperasi: string;
  teamOperasi: string;
  ruangOperasi: string;
}

interface UploadFormProps {
  onUpload: () => void;
  editData?: FormDataType | null;
}

export default function UploadForm({ onUpload, editData }: UploadFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    date: '',
    namaPasien: '',
    nomorRekamMedis: '',
    namaDokter: '',
    jenisBius: '',
    jaminanOperasi:'',
    tindakanOperasi: '',
    teamOperasi: '',
    ruangOperasi: '',
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setIsOpen(true);
    }
  }, [editData]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => !isUploading && setIsOpen(false);

  const resetForm = () => {
    setFormData({ date: '', namaPasien:'', nomorRekamMedis:'', namaDokter:'', jenisBius: '', jaminanOperasi:'', tindakanOperasi: '', teamOperasi: '', ruangOperasi: '',  });
    setFile(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    const method = formData.id ? 'PUT' : 'POST';
    const apiUrl = '/api/post-operasi';

    const sendRequest = async (fileBase64: string | null = null) => {
      // 🔹 Debug: Pastikan data yang dikirim ke API benar
      console.log("📤 Data yang dikirim:", {
        ...formData,
        fileName: file?.name || '',
        fileBase64: fileBase64 || '',
        mimeType: file?.type || '',
      });

      const res = await fetch(apiUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fileName: file?.name || '',
          fileBase64: fileBase64 || '',
          mimeType: file?.type || '',
        }),
      });

      const data = await res.json();
      setIsUploading(false);

      if (data.status === 'success') {
        toast.success(`✅ ${formData.id ? 'Data diperbarui' : 'Data ditambahkan'} berhasil!`);
        onUpload();
        setTimeout(() => {
          resetForm();
          closeModal();
        }, 500);
      } else {
        toast.error(`❌ Gagal: ${data.message}`);
      }
    };

    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        if (!base64Data) {
          toast.error("❌ Gagal mengonversi file ke Base64.");
          setIsUploading(false);
          return;
        }
        await sendRequest(base64Data);
      };
      reader.readAsDataURL(file);
    } else {
      sendRequest();
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <button onClick={openModal} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
        {editData ? 'Edit Operasi' : 'Tambah Operasi'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-slate-900/40 bg-opacity-70 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-600 p-6 rounded-lg shadow-lg w-96 relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold mb-4 text-sky-50">{editData ? ' Edit Data' : 'Tambah Operasi & Upload File'}</h2>
              <button onClick={closeModal} className="absolute top-2 right-2 text-gray-900 hover:text-red-500">
                <CircleX size={20} />
              </button>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-100" required />
                <input type='text' name='namaPasien' placeholder='Nama Pasien' value={formData.namaPasien} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-200" required />
                <input type='text' name='nomorRekamMedis' placeholder='Nomor Rekam Medis' value={formData.nomorRekamMedis} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-200" required />
                <input type="text" name="namaDokter" placeholder="Nama Dokter" value={formData.namaDokter} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-200" required />
                <input type="text" name="jenisBius" placeholder="Jenis Pembiusan" value={formData.jenisBius} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-200" required />
                <input type="text" name="jaminanOperasi" placeholder="Jaminan Operasi" value={formData.jaminanOperasi} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-200" required />
                <input type="text" name="tindakanOperasi" placeholder="Tindakan Operasi" value={formData.tindakanOperasi} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-200" required />
                <input type="text" name="teamOperasi" placeholder="Team Operasi" value={formData.teamOperasi} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-200" required />
                <input type="text" name="ruangOperasi" placeholder="Ruang Operasi" value={formData.ruangOperasi} onChange={handleChange} className="w-full p-2 border rounded-lg text-slate-200" required />
                <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full p-2 border rounded-lg text-slate-200"  />
                <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-700 transition">
                  {isUploading ? 'Mengunggah...' : formData.id ? 'Simpan Perubahan' : 'Unggah & Simpan'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isUploading && (
          <motion.div
            className="fixed inset-0 bg-white bg-opacity-70 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoaderCircle className="animate-spin w-20 h-20 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}