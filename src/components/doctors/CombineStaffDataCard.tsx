"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Badge from "../ui/Badge";
import { OperationRecord } from "@/types/mobile";
import { useStaffData } from "@/hooks/useStaffData";

// Komponen sederhana untuk "lanjutkan baca"
function ReadMoreText({ text, maxLength = 100 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <>{text}</>;
  }

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      <span onClick={toggleReadMore} className="text-blue-500 cursor-pointer ml-1">
        {isExpanded ? "Tutup" : "Lanjutkan baca"}
      </span>
    </>
  );
}

interface DataCardProps {
  data: Record<string, OperationRecord[]>;
  // Bentuknya misal:
  // {
  //   "Sheet1": [ { no: 1, namaDokter: "...", ... }, ... ],
  //   "Sheet2": [ { no: 2, namaDokter: "...", ... }, ... ]
  // }
}

export default function CombinedStaffDataCard({ data }: DataCardProps) {
  const { staffList, loading } = useStaffData();

  // Fungsi untuk mengelompokkan record berdasarkan namaDokter atau teamOperasi
  const groupByDoctor = (records: OperationRecord[]) => {
    return records.reduce((acc: Record<string, OperationRecord[]>, record) => {
      const key = record.namaDokter || record.teamOperasi;
      if (key) {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(record);
      }
      return acc;
    }, {});
  };

  // Fungsi format tanggal
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return isNaN(date.getTime())
      ? dateString
      : `${String(date.getDate()).padStart(2, "0")} ${
          monthNames[date.getMonth()]
        } ${date.getFullYear()}`;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        Data Operasi
      </h2>
      {loading ? (
        <p>Loading staff data...</p>
      ) : (
        // Container animasi utama
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Loop setiap sheet */}
          {Object.entries(data).map(([sheetName, sheetRecords], sheetIndex) => {
            // Kelompokkan record di sheet ini berdasarkan dokter/perawat
            const groupedRecords = groupByDoctor(sheetRecords);

            return (
              <motion.div
                key={sheetName}
                // Sedikit animasi saat setiap sheet muncul
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: sheetIndex * 0.1 }}
                className="mb-8"
              >
                {/* Heading untuk nama sheet */}
                <div className=" w-full bg-amber-200/10 border border-amber-200 rounded-lg shadow-md p-2 items-center mb-2">
                <Badge
                  text={sheetName}
                  color="bg-green-500"
                  className=" text-2xl font-bold"
                /></div>

                {/* Grid yang menampung card untuk masing-masing dokter/perawat */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                  {Object.entries(groupedRecords).map(([doctorName, records]) => {
                    // Cari data staf yang sesuai (perbandingan tidak case-sensitive)
                    const staff = staffList.find(
                      (s) => s.name.toLowerCase() === doctorName.toLowerCase()
                    );

                    return (
                      // Card utama (per dokter/perawat)
                      <motion.div
                        key={doctorName}
                        className="flex flex-col sm:flex-row items-start gap-1 border bg-slate-300/10 border-gray-200 rounded-lg shadow-md p-2 w-full max-w-full"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        {/* Bagian Info Dokter */}
                        <div className="flex flex-col items-center sm:items-start sm:w-1/3">
                          {staff && staff.photoUrl ? (
                            <Image
                              src={staff.photoUrl}
                              alt={staff.name}
                              width={70}
                              height={70}
                              priority
                              className="rounded-full p-1 items-center ml-2 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/no-image.png";
                              }}
                            />
                          ) : (
                            <div className="w-20 h-20 flex items-center justify-center bg-gray-300 rounded-full">
                              No Image
                            </div>
                          )}
                          <h3 className="text-sm font-bold text-gray-200 capitalize mt-2 text-center sm:text-left">
                            {doctorName}
                          </h3>
                          {staff && (
                            <p className="text-xs text-gray-500 capitalize text-right">
                              {staff.role}
                            </p>
                          )}
                        </div>

                        {/* Bagian Detail Operasi */}
                        <div className="flex-1 flex flex-col space-y-2">
                          {records.map((item, idx) => (
                            <motion.div
                              key={`${doctorName}-${item.no}-${idx}`}
                              className="bg-white p-2 border border-gray-200 rounded-lg hover:shadow-lg transition duration-300"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: idx * 0.1,
                                ease: "easeInOut",
                              }}
                            >
                              <Badge
                                text={`${formatDate(item.date)}`}
                                color="bg-green-500"
                                className="mb-2"
                              />
                              <p className="text-sm text-gray-500">
                                Nama Pasien:{" "}
                                <span className="font-semibold">
                                  {item.namaPasien}
                                </span>
                              </p>
                              <p className="text-sm text-gray-500">
                                Nomor Rekam Medis:{" "}
                                <span className="font-semibold">
                                  {item.nomorRekamMedis}
                                </span>
                              </p>
                              <p className="text-sm text-gray-500">
                                Jenis Bius:{" "}
                                <span className="font-semibold">
                                  {item.jenisBius}
                                </span>
                              </p>
                              <p className="text-sm text-gray-500">
                                Tindakan Operasi:{" "}
                                <span className="font-semibold">
                                  <ReadMoreText text={item.tindakanOperasi} maxLength={80} />
                                </span>
                              </p>
                              <p className="text-sm text-gray-500">
                                Perawat:{" "}
                                <span className="font-semibold">
                                  {item.teamOperasi}
                                </span>
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
