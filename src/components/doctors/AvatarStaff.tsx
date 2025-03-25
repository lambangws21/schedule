"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

export default function StaffList() {
  const [dataList, setDataList] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dataDokter/getImages?getImages=true");
        const data: StaffItem[] = await res.json();
        if (Array.isArray(data)) {
          const formatted: DataItem[] = data.map((item: StaffItem) => {
            const name = item["Data Dokter"] || item["Data Perawat"] || "Unknown";
            const spesialis = item.spesialis || "";
            const photoUrl = item.imageUrl || "";
            const role = item.role || (item["Data Dokter"] ? "Dokter" : "Perawat");
            return { name, spesialis, photoUrl, role };
          });
          setDataList(formatted);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-[#0f172a] min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold text-center text-white mb-6">
        Daftar Data
      </h2>

      {/* Container flex horizontal untuk menampung semua foto */}
      <div className="relative flex items-center justify-center">
        {dataList.map((item, index) => {
          // Hitung zIndex menurun, misal item pertama (index=0) => zIndex tertinggi
          const zIndexValue = dataList.length - index;

          return (
            <motion.div
              key={index}
              // zIndex default menurun, -ml-4 jika bukan foto pertama
              style={{ zIndex: zIndexValue }}
              className={`${
                index > 0 ? "-ml-4" : ""
              } w-14 h-14 rounded-full overflow-hidden flex-shrink-0 outline-1 shadow-2xl` }
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              // Saat hover, scale sedikit dan zIndex = 999 agar di depan
              whileHover={{ scale: 1.7, zIndex: 999 }}
            >
              {item.photoUrl ? (
                <Image
                  src={item.photoUrl}
                  alt={item.name}
                  width={56}
                  height={56}
                  className="object-cover w-14 h-14"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/no-image.png";
                  }}
                />
              ) : (
                <div className="bg-gray-700 w-14 h-14 text-white flex items-center justify-center text-xs">
                  No Image
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
