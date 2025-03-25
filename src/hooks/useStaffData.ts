"use client";

import { useEffect, useState } from "react";

interface StaffItem {
  "Data Dokter"?: string;
  "Data Perawat"?: string;
  spesialis?: string;
  imageUrl?: string;
  role?: string;
}

export interface DataItem {
  name: string;
  spesialis: string;
  photoUrl: string;
  role: string;
}

export function useStaffData() {
  const [staffList, setStaffList] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
          setStaffList(formatted);
        } else {
          console.error("Staff data is not an array:", data);
        }
      } catch (err) {
        console.error("Error fetching staff data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { staffList, loading, error };
}
