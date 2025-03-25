"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Doctor {
  name: string;
  photoUrl: string;
}

export default function DoctorsList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbx5lkScn9EOrS9tyhA6e0jkUPbwtTW89Bi4fTAzU-OcCdd2MlrHeFUVfUEq1Xufzt4j/exec"
        ); // Ganti dengan URL Apps Script
        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedDoctors = data.map((doctor) => ({
            name: doctor.name || "Unknown",
            photoUrl: doctor.photoUrl || "/no-image.png", // Jika tidak ada foto
          }));

          setDoctors(formattedDoctors);
        } else {
          console.error("Error: Data bukan array:", data);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center text-white mb-6">Daftar Dokter</h2>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {doctors.map((doctor, index) => (
          <motion.div
            key={index}
            className="bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-700"
            whileHover={{ scale: 1.05, boxShadow: "0px 4px 20px rgba(255, 255, 255, 0.2)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Image
              src={doctor.photoUrl}
              alt={doctor.name}
              width={300}
              height={300}
              className="w-full h-auto rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/no-image.png"; // Ganti ke placeholder jika error
              }}
            />
            <p className="text-center font-semibold mt-3 text-white">{doctor.name}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
