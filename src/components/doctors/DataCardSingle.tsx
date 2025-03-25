"use client";

import React from "react";
import { motion } from "framer-motion";
import Badge from "../ui/Badge";
import { OperationRecord } from "@/types/mobile";

interface DataCardSingleProps {
  sheetName: string;
  records: OperationRecord[];
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return isNaN(date.getTime())
    ? dateString
    : `${String(date.getDate()).padStart(2, "0")} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const DataCardSingle: React.FC<DataCardSingleProps> = ({ sheetName, records }) => {
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
            key={`${sheetName}-${item.no}-${index}`}
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

export default DataCardSingle;
