"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Doctor {
  name: string;
  photoId?: string; // Bisa undefined
}

const DoctorProfile: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/getDoctors");
        if (!response.ok) throw new Error("Gagal mengambil data");

        const data: Doctor[] = await response.json();
        setDoctors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {doctors.map((doctor, index) => (
        <div
          key={index}
          className="flex items-center gap-4 bg-white shadow-md rounded-lg p-4"
        >
          {doctor.photoId ? (
            <Image
              src={`https://lh3.googleusercontent.com/d/${doctor.photoId}`}
              alt={doctor.name}
              width={64} // ukuran 64x64 px
              height={64}
              className="rounded-full object-cover border-2 border-gray-300"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-xs">
              No Image
            </div>
          )}
          <span className="text-lg font-medium">{doctor.name}</span>
        </div>
      ))}
    </div>
  );
};

export default DoctorProfile;
