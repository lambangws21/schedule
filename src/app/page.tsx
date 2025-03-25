"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import CardUi from "@/components/doctors/AvatarStaff";
import CombinedStaffDataCard from "@/components/doctors/OperationRecaordCard";
import { OperationRecord } from "@/types/mobile";

interface FetchResponse {
  status: string;
  data?: Record<string, OperationRecord[]>;
}

const UiPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Record<string, OperationRecord[]>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dataDokter/dokter");
      const json = (await res.json()) as FetchResponse;
      if (json.status === "success" && json.data) {
        setData(json.data);
      } else {
        setData({});
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Jika masih loading, tampilkan pesan
  if (loading) {
    return <p className="p-4 text-white">Loading...</p>;
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-900 p-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Bagian Kiri: konten utama */}
        <motion.div
          className="w-full md:w-3/4 space-y-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <CombinedStaffDataCard data={data} />
        </motion.div>

        {/* Bagian Kanan: sidebar sticky di layar md ke atas */}
        <motion.div
          className="w-full md:w-1/4 space-y-4 mt-4 md:mt-0 md:sticky md:top-4 h-fit"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <CardUi />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UiPage;
