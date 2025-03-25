"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Badge from "../ui/Badge";
import { DataType } from "@/types/mobile";

// Fungsi untuk memformat tanggal
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return isNaN(date.getTime())
    ? dateString
    : `${String(date.getDate()).padStart(2, "0")} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

// Komponen untuk menampilkan data dari SEMUA sheet
interface DataCardProps {
  data: Record<string, DataType[]>;
}

export const DataCard: React.FC<DataCardProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {Object.entries(data).map(([sheetName, records]) => (
        <div key={sheetName} className="w-[430px] p-4 space-x-1 mb-2">
          <h2 className="text-xl font-bold mb-2 text-gray-700">{sheetName}</h2>
          {records.map((item, index) => (
            <motion.div
              key={`${sheetName}-${index}`}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition duration-300 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge text={`Tanggal: ${formatDate(item.date)}`} color="bg-green-500" className="mb-2" />
              <p className="text-sm text-gray-500">
                Nama Pasien: <span className="font-semibold">{item.namaPasien}</span>
              </p>
              <p className="text-sm text-gray-500">
                Nomor Rekam Medis: <span className="font-semibold">{item.nomorRekamMedis}</span>
              </p>
              <p className="text-sm text-gray-500">
                Dokter: <span className="font-semibold">{item.namaDokter}</span>
              </p>
              <p className="text-sm text-gray-500">
                Jenis Bius: <span className="font-semibold">{item.jenisBius}</span>
              </p>
              <p className="text-sm text-gray-500">
                Tindakan Operasi: <span className="font-semibold">{item.tindakanOperasi}</span>
              </p>
              <p className="text-sm text-gray-500">
                Perawat: <span className="font-semibold">{item.teamOperasi}</span>
              </p>
            </motion.div>
          ))}
        </div>
      ))}
    </motion.div>
  );
};

// Komponen untuk menampilkan data dari sheet spesifik
interface DataCardSingleProps {
  sheetName: string;
  records: DataType[];
}

export const DataCardSingle: React.FC<DataCardSingleProps> = ({ sheetName, records }) => {
  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">Data dari {sheetName}</h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {records.map((item, index) => (
          <motion.div
            key={`${sheetName}-${index}`}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition duration-300 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge text={`Tanggal: ${formatDate(item.date)}`} color="bg-green-500" className="mb-2" />
            <p className="text-sm text-gray-500">
              Nama Pasien: <span className="font-semibold">{item.namaPasien}</span>
            </p>
            <p className="text-sm text-gray-500">
              Nomor Rekam Medis: <span className="font-semibold">{item.nomorRekamMedis}</span>
            </p>
            <p className="text-sm text-gray-500">
              Dokter: <span className="font-semibold">{item.namaDokter}</span>
            </p>
            <p className="text-sm text-gray-500">
              Jenis Bius: <span className="font-semibold">{item.jenisBius}</span>
            </p>
            <p className="text-sm text-gray-500">
              Tindakan Operasi: <span className="font-semibold">{item.tindakanOperasi}</span>
            </p>
            <p className="text-sm text-gray-500">
              Perawat: <span className="font-semibold">{item.teamOperasi}</span>
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// Komponen parent yang menyediakan pilihan sheet
const SheetSelector: React.FC = () => {
  const [selectedSheet, setSelectedSheet] = useState("all");
  // Data diharapkan berbentuk objek: { [sheetName]: DataType[] }
  const [data, setData] = useState<Record<string, DataType[]>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Kita ambil data semua sheet agar dapat digunakan jika pilihan "all" maupun sheet spesifik
      const res = await fetch("/api/dataDokter/dokter");
      const json = await res.json();
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
        <DataCardSingle
          sheetName={selectedSheet}
          records={data[selectedSheet] || []}
        />
      )}
    </div>
  );
};

export default SheetSelector;
