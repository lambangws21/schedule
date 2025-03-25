"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Badge from "../ui/Badge";
import { OperationRecord } from "@/types/mobile";

// Opsi: jika Anda ingin "read more" pada tindakanOperasi, gunakan ini
function ReadMoreText({ text, maxLength = 100 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (text.length <= maxLength) {
    return <>{text}</>;
  }

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  return (
    <>
      {isExpanded ? text : `${text.substring(0, maxLength)}...`}
      <span onClick={toggleReadMore} className="text-blue-500 cursor-pointer ml-1">
        {isExpanded ? "Tutup" : "Lanjutkan baca"}
      </span>
    </>
  );
}

interface StaffItem {
  "Data Dokter"?: string;
  "Data Perawat"?: string;
  spesialis?: string;
  imageUrl?: string;
  role?: string;
}

interface DataItem {
  name: string;
  spesialis: string;
  photoUrl: string;
  role: string;
}


interface DataCardProps {
  data: Record<string, OperationRecord[]>;
}

export default function CombinedStaffDataCard({ data }: DataCardProps) {
  const [staffList, setStaffList] = useState<DataItem[]>([]);

  // Ambil data staff (foto dll.)
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("/api/dataDokter/getImages?getImages=true");
        const staffData: StaffItem[] = await res.json();
        if (Array.isArray(staffData)) {
          const formatted: DataItem[] = staffData.map((item) => {
            const name = item["Data Dokter"] || item["Data Perawat"] || "Unknown";
            const spesialis = item.spesialis || "";
            const photoUrl = item.imageUrl || "";
            const role = item.role || (item["Data Dokter"] ? "dokter" : "perawat");
            return { name, spesialis, photoUrl, role };
          });
          setStaffList(formatted);
        } else {
          console.error("Staff data is not an array:", staffData);
        }
      } catch (err) {
        console.error("Error fetching staff data:", err);
      }
    };

    fetchStaff();
  }, []);

  // Gabungkan semua data operasi jadi satu array
  const allRecords = Object.values(data).flat();

  // Kelompokkan data operasi berdasarkan namaDokter / teamOperasi
  const groupedRecords = allRecords.reduce(
    (acc: Record<string, OperationRecord[]>, record) => {
      const key = record.namaDokter || record.teamOperasi;
      if (key) {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(record);
      }
      return acc;
    },
    {}
  );

  // **Pertahankan** baris ini dan gunakan agar ESLint tidak protes:
  const groupedInSheet = groupedRecords;
  // Contoh penggunaan minimal: hitung jumlah group
  const groupCount = Object.keys(groupedInSheet).length;
  console.log(`Total group (global grouping): ${groupCount}`);

  // Format tanggal
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const monthNames = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember",
    ];
    return isNaN(date.getTime())
      ? dateString
      : `${String(date.getDate()).padStart(2, "0")} ${
          monthNames[date.getMonth()]
        } ${date.getFullYear()}`;
  };

  // Ambil daftar sheet dan record
  const sheetEntries = Object.entries(data);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        Data Operasi
      </h2>

      {/* Container animasi utama */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {sheetEntries.map(([sheetName, sheetRecords], sheetIndex) => {
          // Buat grouping per sheetName:
          const localGrouped = sheetRecords.reduce(
            (acc: Record<string, OperationRecord[]>, rec) => {
              const key = rec.namaDokter || rec.teamOperasi;
              if (key) {
                if (!acc[key]) {
                  acc[key] = [];
                }
                acc[key].push(rec);
              }
              return acc;
            },
            {}
          );

          const localGroups = Object.entries(localGrouped);

          return (
            <motion.div
              key={sheetName}
              className="w-full p-4 space-y-2 mb-2 border border-gray-200 rounded-xl shadow-md bg-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: sheetIndex * 0.1 }}
              whileHover={{ scale: 1.01 }}
            >
              {/* Tampilkan asal sheet -> OR */}
              <Badge
                text={`OR: ${sheetName}`}
                color="bg-orange-500"
                className="mb-2"
              />

              {localGroups.map(([name, records]) => {
                // Temukan staff
                const staff = staffList.find(
                  (s) => s.name.toLowerCase() === name.toLowerCase()
                );

                return (
                  <div key={name} className="mb-4 border-b pb-4 last:border-b-0">
                    {/* Header info Dokter/Perawat */}
                    <div className="flex items-center space-x-4 mb-2">
                      {/* Foto staff bulat */}
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                        {staff && staff.photoUrl ? (
                          <Image
                            src={staff.photoUrl}
                            alt={staff.name}
                            width={64}
                            height={64}
                            className="object-cover w-16 h-16"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/no-image.png";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-gray-600">
                            No Image
                          </div>
                        )}
                      </div>
                      {/* Nama & Role */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-700 capitalize">
                          {name}
                        </h3>
                        {staff && (
                          <p className="text-xs text-gray-500 capitalize">
                            {staff.role}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* List detail operasi */}
                    <div className="space-y-2">
                      {records.map((item, idx) => (
                        <motion.div
                          key={`${name}-${item.no}-${idx}`}
                          className="bg-gray-50 rounded-lg p-2 border border-gray-200 hover:shadow-sm transition duration-300"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: idx * 0.05 }}
                          whileHover={{ scale: 1.01 }}
                        >
                          {/* Tanggal */}
                          <Badge
                            text={`Tgl: ${formatDate(item.date)}`}
                            color="bg-green-500"
                            className="mb-1"
                          />

                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Pasien:</span>{" "}
                            {item.namaPasien}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">No. RM:</span>{" "}
                            {item.nomorRekamMedis}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Bius:</span>{" "}
                            {item.jenisBius}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Tindakan:</span>{" "}
                            <ReadMoreText text={item.tindakanOperasi} maxLength={60} />
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Team:</span>{" "}
                            {item.teamOperasi}
                          </p>

                          {/* Jika item.namaDokter ada dan berbeda dengan name, tampilkan */}
                          {item.namaDokter && item.namaDokter.toLowerCase() !== name.toLowerCase() && (
                            <p className="text-sm text-gray-500 italic mt-1">
                              Dokter: {item.namaDokter}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
