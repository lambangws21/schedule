"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DataCard from "./DataCard";
import DataCardSingle from "./DataCardSingle";
import EditRecordForm from "./EditRecordForm";
import { OperationRecord } from "@/types/mobile";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmModal from "./ConfirmModal";

interface FetchResponse {
  status: string;
  data: Record<string, OperationRecord[]>;
  error?: string;
}

const SheetSelector: React.FC = () => {
  const [selectedSheet, setSelectedSheet] = useState("all");
  const [data, setData] = useState<Record<string, OperationRecord[]>>({});
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<OperationRecord | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<OperationRecord | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dataDokter/dokter");
      const json = (await res.json()) as FetchResponse;
      if (json.status === "success" && json.data) {
        setData(json.data);
      } else {
        setData({});
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSheetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSheet(e.target.value);
  };

  // Edit button handler
  const handleEdit = (record: OperationRecord) => {
    if (selectedSheet === "all") {
      toast.error("Pilih sheet spesifik untuk melakukan edit.");
      return;
    }
    setEditingRecord(record);
  };

  // Delete button handler yang memunculkan modal konfirmasi
  const handleDelete = (record: OperationRecord) => {
    if (selectedSheet === "all") {
      toast.error("Pilih sheet spesifik untuk melakukan delete.");
      return;
    }
    setRecordToDelete(record);
    setConfirmModalOpen(true);
  };

  // Fungsi untuk mengonfirmasi penghapusan record
  const handleConfirmDelete = async () => {
    if (!recordToDelete) return;
    try {
      const res = await fetch("/api/dataDokter/delput", {
        method: "POST", // tetap POST karena Google Apps Script hanya support GET & POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          methodOverride: "DELETE",
          no: recordToDelete.no,
          targetSheet: selectedSheet,
        }),
      });
      const text = (await res.text()).trim();
      const result = text ? JSON.parse(text) : {};
      if (result.status === "success") {
        toast.success(`Berhasil ${recordToDelete.namaPasien} pasien ${recordToDelete.namaDokter} berhasil dihapus.`);
        fetchData();
      } else {
        toast.error(`Gagal menghapus: ${result.error || result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Error deleting record");
    } finally {
      setConfirmModalOpen(false);
      setRecordToDelete(null);
    }
  };

  // Fungsi untuk membatalkan penghapusan record
  const handleCancelDelete = () => {
    setConfirmModalOpen(false);
    setRecordToDelete(null);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="sheetSelect" className="block mb-1">
          Pilih Sheet:
        </label>
        <select
          id="sheetSelect"
          value={selectedSheet}
          onChange={handleSheetChange}
          className="border p-2"
        >
          <option value="all">Semua Sheet</option>
          <option value="Sheet1">Sheet1</option>
          <option value="Sheet2">Sheet2</option>
          <option value="Sheet3">Sheet3</option>
          <option value="Sheet4">Sheet4</option>
        </select>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : selectedSheet === "all" ? (
        <DataCard data={data} />
      ) : (
        <div>
          <DataCardSingle sheetName={selectedSheet} records={data[selectedSheet] || []} />
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">
              Aksi Update & Delete (Sheet: {selectedSheet})
            </h2>
            <motion.table
              className="w-full border-collapse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <thead>
                <tr>
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Nama Pasien</th>
                  <th className="border px-2 py-1">Nomor Rekam Medis</th>
                  <th className="border px-2 py-1">Jaminan Operasi</th>
                  <th className="border px-2 py-1">Nama Dokter</th>
                  <th className="border px-2 py-1">Jenis Bius</th>
                  <th className="border px-2 py-1">Ruang Operasi</th>
                  <th className="border px-2 py-1">Jenis Operasi</th>
                  <th className="border px-2 py-1">Team Operasi</th>
                  <th className="border px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data[selectedSheet] || []).map((rec, index) => (
                  <motion.tr
                    key={`sheet-specific-${rec.no}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="transition-all duration-300 hover:bg-gray-100"
                  >
                    <td className="border px-2 py-1">{rec.date}</td>
                    <td className="border px-2 py-1">{rec.namaPasien}</td>
                    <td className="border px-2 py-1">{rec.nomorRekamMedis}</td>
                    <td className="border px-2 py-1">{rec.jaminanOperasi}</td>
                    <td className="border px-2 py-1">{rec.namaDokter}</td>
                    <td className="border px-2 py-1">{rec.jenisBius}</td>
                    <td className="border px-2 py-1">{rec.tindakanOperasi}</td>
                    <td className="border px-2 py-1">{rec.ruangOperasi}</td>
                    <td className="border px-2 py-1">{rec.teamOperasi}</td>
                    <td className="border px-2 py-1">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 mr-2"
                        onClick={() => handleEdit(rec)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1"
                        onClick={() => handleDelete(rec)}
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        </div>
      )}

      {/* Form untuk mengedit record */}
      <AnimatePresence>
        {editingRecord && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <motion.div
              className="bg-white p-4 rounded shadow-md max-w-md w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EditRecordForm
                record={editingRecord}
                targetSheet={selectedSheet}
                onUpdate={fetchData}
                onClose={() => setEditingRecord(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal konfirmasi untuk delete */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Konfirmasi Hapus"
        message={`Apakah Anda yakin akan menghapus ${
          recordToDelete?.namaPasien || ""
        } pasien ${recordToDelete?.namaDokter || ""}?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <ToastContainer />
    </div>
  );
};

export default SheetSelector;
