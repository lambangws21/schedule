"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Badge from "../ui/Badge";
import { OperationRecord } from "@/types/mobile";

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

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch("/api/dataDokter/getImages?getImages=true");
        const data: StaffItem[] = await res.json();
        if (Array.isArray(data)) {
          const formatted: DataItem[] = data.map((item: StaffItem) => {
            const name =
              item["Data Dokter"] || item["Data Perawat"] || "Unknown";
            const spesialis = item.spesialis || "";
            const photoUrl = item.imageUrl || "";
            const role =
              item.role || (item["Data Dokter"] ? "dokter" : "perawat");
            return { name, spesialis, photoUrl, role };
          });
          setStaffList(formatted);
        } else {
          console.error("Staff data is not an array:", data);
        }
      } catch (err) {
        console.error("Error fetching staff data:", err);
      }
    };

    fetchStaff();
  }, []);

  // Gabungkan semua data operasi dari masing-masing sheet
  const allRecords = Object.values(data).flat();

  // Kelompokkan data operasi berdasarkan nama dokter atau, jika tidak ada, perawatnya
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

  const groups = Object.entries(groupedRecords);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        Data Operasi
      </h2>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {groups.map(([name, records]) => {
          // Cari data staf yang memiliki nama sama (pembandingan tidak case-sensitive)
          const staff = staffList.find(
            (s) => s.name.toLowerCase() === name.toLowerCase()
          );
          return (
            <div
              key={name}
              className="w-[430px] p-4 space-y-2 mb-2 border border-gray-200 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                {staff && staff.photoUrl ? (
                  <Image
                    src={staff.photoUrl}
                    alt={staff.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/no-image.png";
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 flex items-center justify-center bg-gray-300 rounded-full">
                    No Image
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-700 capitalize">
                    {name}
                  </h3>
                  {staff && (
                    <p className="text-sm text-gray-500 capitalize">
                      {staff.role}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-2">
                {records.map((item, idx) => (
                  <motion.div
                    key={`${name}-${item.no}-${idx}`}
                    className="flex justify-center  bg-white shadow-sm rounded-lg p-2 border border-gray-200 hover:shadow-lg transition duration-300 mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.1, delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="bg-red-400">
                      <Badge
                        text={`Tanggal: ${formatDate(item.date)}`}
                        color="bg-green-500"
                        className="mb-2"
                      />
                      <p className="text-sm text-gray-500">
                        Nama Pasien:{" "}
                        <span className="font-semibold">{item.namaPasien}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Nomor Rekam Medis:
                        <span className="font-semibold">
                          {item.nomorRekamMedis}
                        </span>
                      </p>
                   
                      <p className="text-sm text-gray-500">
                        Jenis Bius:{" "}
                        <span className="font-semibold">{item.jenisBius}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Tindakan Operasi:{" "}
                        <span className="font-semibold">
                          {item.tindakanOperasi}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Perawat:{" "}
                        <span className="font-semibold">
                          {item.teamOperasi}
                        </span>
                      </p>
                    </div>
                    <div className="bg-yellow-200">
                    <p className="text-sm text-gray-500">
                        Dokter:
                        <span className="font-semibold">{item.namaDokter}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
