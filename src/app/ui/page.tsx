"use client";

import React, { useState, useEffect, useCallback } from "react";
import CardUi from "@/components/doctors/DoctorCard";
import { OperationRecord } from "@/types/mobile";
import CombinedStaffDataCard from "@/components/doctors/CombineStaffDataCard";

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

  return (
    <div className="p-4">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-4">
          <CardUi  />
          <CombinedStaffDataCard data={data} />
        </div>
      )}
    </div>
  );
};

export default UiPage;