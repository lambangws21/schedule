"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EditForm from "./form-edit";
import { Trash2, Edit2, Eye } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { DataRow } from "@/types/mobile";
import "react-toastify/dist/ReactToastify.css";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? dateString : date.toLocaleDateString("id-ID");
};

export default function ListData() {
  const [dataList, setDataList] = useState<DataRow[]>([]);
  const [editData, setEditData] = useState<DataRow | null>(null);
  const [deleteData, setDeleteData] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      const res = await fetch("/api/get-operasi");
      const result: { status: string; data: DataRow[] } = await res.json();

      if (result.status === "success") {
        const parsedData: DataRow[] = result.data.map((row) => ({
          no: Number(row.no),
          date: row.date,
          namaPasien: row.namaPasien,
          nomorRekamMedis: row.nomorRekamMedis,
          namaDokter: row.namaDokter,
          jenisBius: row.jenisBius,
          jaminanOperasi: row.jaminanOperasi,
          tindakanOperasi: row.tindakanOperasi,
          teamOperasi: row.teamOperasi,
          ruangOperasi: row.ruangOperasi,
          status: row.status,
        }));
        setDataList(parsedData);
      } else {
        toast.error("❌ Gagal memuat data");
      }
    } catch {
      toast.error("⚠️ Terjadi kesalahan saat memuat data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      const res = await fetch("/api/delput", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ no: deleteData }),
      });
      const result = await res.json();
      if (result.status === "success") {
        toast.success("✅ Data berhasil dihapus!");
        fetchData();
        setDeleteData(null);
      } else {
        toast.error(`❌ Gagal menghapus: ${result.message}`);
      }
    } catch {
      toast.error("⚠️ Terjadi kesalahan saat menghapus data");
    }
  };

  const totalPages = Math.ceil(dataList.length / itemsPerPage);
  const paginatedData = dataList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {editData && (
        <EditForm
          editData={editData}
          onClose={() => setEditData(null)}
          onUpdate={fetchData}
        />
      )}

      <div className="w-full min-h-screen mx-auto p-8">
        <motion.div
          className="mt-8 w-full overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-semibold text-center mb-4">
            📋 Daftar Data Operasi
          </h2>
          <table className="w-full bg-slate-200 rounded-lg border-0 text-slate-600 p-2 text-sm">
            <thead>
              <tr className="text-slate-400">
                <th className="p-2 border-b-1 text-xl font-semibold text-slate-600 text-left">Tanggal</th>
                <th className="p-2 border-b-1 text-xl font-semibold text-slate-600 text-left">Nama Pasien</th>
                <th className="p-2 border-b-1 text-xl font-semibold text-slate-600 text-left">Nomor RM</th>
                <th className="p-2 border-b-1 text-xl font-semibold text-slate-600 text-left">Dokter</th>
                <th className="p-2 border-b-1 text-xl font-semibold text-slate-600 text-left">Jenis Bius</th>
                <th className="p-2 border-b-1 text-xl font-semibold text-slate-600 text-left">Jaminan</th>
                <th className="p-2 border-b-1 text-xl font-semibold text-slate-600 text-left">Tindakan</th>
                <th className="p-2 border-b-1 text-xl font-semibold text-slate-600 text-left">Tim</th>
                <th className="p-2 border-b-1 text-xl font-semibold text-slate-600 text-left">Ruang</th>
                <th className="p-2 border-b-1 text-xl font-semibold text-slate-600 text-left">Status</th>
                <th className="p-2 border-b-1 text-xl font-semibold text-slate-600 text-left">Aksi</th>
              </tr>
            </thead>
            <motion.tbody
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9 }}
            >
              {paginatedData.map((item) => (
                <tr
                  key={item.no}
                  className="bg-slate-200 hover:bg-slate-50 transition"
                >
                  <td className="p-2 border-b-1 font-medium text-lg  text-slate-600 text-left">
                    {formatDate(item.date)}
                  </td>
                  <td className="p-2 border-b-1 text-left font-medium text-lg text-slate-900">{item.namaPasien}</td>
                  <td className="p-2 border-b-1 text-left font-medium text-lg text-slate-800">{item.nomorRekamMedis}</td>
                  <td className="p-2 border-b-1 text-left font-medium text-lg text-slate-800">{item.namaDokter}</td>
                  <td className="p-2 border-b-1 text-left font-medium text-lg text-slate-800">{item.jenisBius}</td>
                  <td className="p-2 border-b-1 text-left font-medium text-lg text-slate-800">{item.jaminanOperasi}</td>
                  <td className="p-2 border-b-1 text-left font-medium text-lg text-slate-800">{item.tindakanOperasi}</td>
                  <td className="p-2 border-b-1 text-left font-medium text-lg text-slate-800">{item.teamOperasi}</td>
                  <td className="p-2 border-b-1 text-left font-medium text-lg text-slate-800">{item.ruangOperasi}</td>
                  <td className="p-2 border-b-1 text-left font-medium text-lg text-slate-800 ">
                    <a
                      href={item.status}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      <Eye className="w-5 h-5 mx-auto" />
                    </a>
                  </td>
                  <td className="p-2 border-b-1 text-left font-medium text-lg text-slate-800 space-x-2" >
                    <button
                      onClick={() => setEditData(item)}
                      className="text-green-500"
                    >
                      <Edit2 className="w-5 h-5 hover:scale-110 transition cursor-pointer" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm("Apakah Anda yakin ingin menghapus data ini?")
                        ) {
                          setDeleteData(item.no);
                          handleDelete();
                        }
                      }}
                      className="text-red-500"
                    >
                      <Trash2 className="w-5 h-5 hover:scale-110 transition curosr-pointer" />
                    </button>
                  </td>
                </tr>
              ))}
            </motion.tbody>
          </table>
        </motion.div>

        <div className="flex justify-center items-center mt-4 gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
