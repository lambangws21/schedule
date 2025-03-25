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
            const role = item.role || (item["Data Dokter"] ? "dokter" : "perawat");
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
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center text-white mb-6">Daftar Data</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {dataList.map((item, index) => (
          <motion.div
            key={index}
            className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-700"
            whileHover={{ scale: 1.05, boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.2)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            {item.photoUrl ? (
              <Image
                src={item.photoUrl}
                alt={item.name}
                width={300}
                height={300}
                priority
                className="w-full h-auto rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/no-image.png";
                }}
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-800 text-white">
                No Image
              </div>
            )}
            <div className="mt-3 text-center">
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-sm text-gray-300">{item.spesialis}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
