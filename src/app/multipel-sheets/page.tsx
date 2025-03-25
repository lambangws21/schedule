"use client";

import { useEffect, useState } from "react";
import TabelComponent from "@/components/multipel-sheets/DataCard";
// import FormComponent from "@/components/multipel-sheets/FormComponent";
import ModalComponent from "@/components/multipel-sheets/modal-component";
import FormOption from "@/components/multipel-sheets/DoctorOption";
import Button from "@/components/ui/Button";
import { DataType } from "@/types/mobile";

const MultipelSheets = () => {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState<Record<string, DataType[]>>({}); // Menyimpan data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sheets");
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="mt-9">
        <Button onClick={() => setShowModal(true)}>Tambah Operasi</Button>
      </div>

      {/* <ModalComponent isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="p-2 bg-slate-500/10 rounded-lg shadow-lg ">
          <h2 className="text-lg font-bold mb-4 text-slate-900">Tambah Data</h2>
          <FormComponent onClose={() => setShowModal(false)} />
        </div>
      </ModalComponent> */}

      <ModalComponent isOpen={showModal} onClose={() => setShowModal(false)}>
      <div className="p-2 bg-slate-500/10 rounded-lg shadow-lg ">
          <h2 className="text-lg font-bold mb-4 text-slate-900">Tambah Data</h2>
          <FormOption onClose={() => setShowModal(false)} />
        </div>
       
      </ModalComponent>

      {/* Menampilkan loading jika data masih di-fetch */}
      {loading ? (
        <p className="text-center text-gray-500">Memuat data...</p>
      ) : (
        <TabelComponent data={data} />
      )}
    </>
  );
};

export default MultipelSheets;
