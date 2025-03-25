"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Badge from "../ui/Badge";
import { OperationRecord } from "@/types/mobile";
import { useStaffData } from "@/hooks/useStaffData";
import DropdownBadgeGroup from "../ui/ResponsiveBadge";

// Komponen sederhana untuk "lanjutkan baca"
function ReadMoreText({
  text,
  maxLength = 100,
}: {
  text: string;
  maxLength?: number;
}) {
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
      <span
        onClick={toggleReadMore}
        className="text-blue-500 cursor-pointer ml-1"
      >
        {isExpanded ? "Tutup" : "Lanjutkan baca"}
      </span>
    </>
  );
}

interface DataCardProps {
  data: Record<string, OperationRecord[]>;
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {Object.entries(data).map(([sheetName, sheetRecords], sheetIndex) => {
            const groupedRecords = groupByDoctor(sheetRecords);

            return (
              <motion.div
                key={sheetName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                  delay: sheetIndex * 0.1,
                }}
                className="mb-8"
              >
                {/* Heading untuk nama sheet */}
                <div className="w-full bg-amber-200/10 border border-amber-200 rounded-lg shadow-md p-2 items-center mb-2">
                  <Badge
                    text={sheetName}
                    color="bg-green-500"
                    className="text-2xl font-bold"
                  />
                </div>

                {/* Grid yang menampung card untuk masing-masing dokter/perawat */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                  {Object.entries(groupedRecords).map(
                    ([doctorName, records]) => {
                      const staff = staffList.find(
                        (s) => s.name.toLowerCase() === doctorName.toLowerCase()
                      );

                      return (
                        <motion.div
                          key={doctorName}
                          className="flex flex-col md:flex-row items-start gap-2 border bg-slate-300/10 border-gray-200 rounded-lg shadow-md p-2 w-full max-w-full"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          {/* Bagian Info Dokter */}
                          <div className="w-full md:w-1/4 flex flex-col items-center md:items-start">
                            {staff && staff.photoUrl ? (
                              <Image
                                src={staff.photoUrl}
                                alt={staff.name}
                                width={50}
                                height={50}
                                priority
                                className="rounded-full p-1 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/no-image.png";
                                }}
                              />
                            ) : (
                              <div className="w-20 h-20 flex items-center justify-center bg-gray-300 rounded-full">
                                No Image
                              </div>
                            )}
                            <h3 className="text-sm font-bold text-gray-700 capitalize mt-2 text-center md:text-left">
                              {doctorName}
                            </h3>
                            {staff && (
                              <p className="text-xs text-gray-500 capitalize">
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
                                {/* Bagian Badges untuk ringkasan cepat */}
                                <div className="mb-2 flex flex-wrap gap-2 flex-inline">
                                  <DropdownBadgeGroup
                                    date={formatDate(item.date)}
                                    bius={item.jenisBius}
                                  />
                                </div>

                                {/* Info lebih detail, dengan label tebal */}
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">
                                    Pasien:
                                  </span>{" "}
                                  {item.namaPasien}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <span className="font-semibold">
                                    No.RM:
                                  </span>{" "}
                                  {item.nomorRekamMedis}
                                </p>
                                <p className="text-sm text-gray-600 text-balance">
                                  <span className="font-semibold">
                                    Tindakan:
                                  </span>{" "}
                                  <ReadMoreText
                                    text={item.tindakanOperasi}
                                    maxLength={80}
                                  />
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    }
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
