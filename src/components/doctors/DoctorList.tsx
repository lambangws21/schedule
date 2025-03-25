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
        const response = await fetch("/api/doctors"); // Ganti dengan URL Apps Script kamu
        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedDoctors = data.map((doctor) => ({
            name: doctor["Data Dokter"] || "Unknown",
            photoUrl: doctor.GoogleDriveID
              ? `https://drive.google.com/uc?export=view&id=${doctor.GoogleDriveID}`
              : "/no-image.png",
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
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">Daftar Dokter</h2>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {doctors.map((doctor, index) => (
          <motion.div
            key={index}
            className="border p-4 rounded-xl bg-white shadow hover:shadow-lg transition"
            whileHover={{ scale: 1.03 }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Image
              src={doctor.photoUrl || "/no-image.png"}
              alt={doctor.name}
              width={300}
              height={300}
              className="object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/no-image.png";
              }}
            />

            <p className="text-center font-medium mt-3">{doctor.name}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
