"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";

// Spinner sederhana
function Spinner() {
  return (
    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
  );
}

export interface StaffItem {
  ID: number;
  "Data Dokter"?: string;
  "Data Perawat"?: string;
  spesialis?: string;
  GoogleDriveID?: string;
  imageUrl?: string;
  role?: string;
}

export interface DataItem {
  id: number;
  name: string;
  spesialis: string;
  googleDriveID: string;
  imageUrl: string;
  role: "dokter" | "perawat";
  targetSheet: "Sheet5" | "Sheet6";
}

export default function StaffTable() {
  const [dataList, setDataList] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false); // untuk fetch data
  const [filter, setFilter] = useState<"semua" | "dokter" | "perawat">("semua");

  // State untuk menampung data yang ingin dihapus (untuk modal konfirmasi)
  const [itemToDelete, setItemToDelete] = useState<DataItem | null>(null);

  // State khusus untuk menampilkan spinner saat delete
  const [isDeleting, setIsDeleting] = useState(false);

  // Fungsi untuk mengambil data dari API
  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dataDokter/getImages?getImages=true");
      const data: StaffItem[] = await res.json();
      if (Array.isArray(data)) {
        const formatted: DataItem[] = data.map((item) => {
          const name = item["Data Dokter"] || item["Data Perawat"] || "Unknown";
          const spesialis = item.spesialis || "";
          const googleDriveID = item.GoogleDriveID || "";
          const role: "dokter" | "perawat" = item["Data Dokter"] ? "dokter" : "perawat";
          const targetSheet: "Sheet5" | "Sheet6" =
            role === "dokter" ? "Sheet5" : "Sheet6";
          return {
            id: item.ID,
            name,
            spesialis,
            googleDriveID,
            imageUrl: item.imageUrl || "",
            role,
            targetSheet,
          };
        });
        setDataList(formatted);
      } else {
        console.error("Data is not an array", data);
      }
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handler untuk filter dropdown
  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value as "semua" | "dokter" | "perawat");
  };

  // Filter data sesuai pilihan
  const filteredData = dataList.filter((item) => {
    if (filter === "semua") return true;
    if (filter === "dokter") return item.targetSheet === "Sheet5";
    if (filter === "perawat") return item.targetSheet === "Sheet6";
    return true;
  });

  // Fungsi untuk menampilkan modal konfirmasi delete
  const handleDeleteClick = (item: DataItem) => {
    setItemToDelete(item);
  };

  // Fungsi untuk membatalkan delete
  const handleCancelDelete = () => {
    setItemToDelete(null);
  };

  // Fungsi untuk menghapus data (memanggil API DELETE) setelah konfirmasi
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      setIsDeleting(true); // Tampilkan spinner
      const payload = {
        no: itemToDelete.id,
        targetSheet: itemToDelete.targetSheet,
        methodOverride: "DELETE",
      };
      const res = await fetch("/api/dataDokter/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        // Hapus data dari state agar tampilan tabel terupdate
        setDataList((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      } else {
        console.error("Delete failed", result);
      }
    } catch (error) {
      console.error("Error deleting record", error);
    } finally {
      setIsDeleting(false); 
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center text-white mb-6">Daftar Staff</h2>
      <div className="mb-4">
        <label htmlFor="filterSelect" className="block mb-1 text-white">
          Tampilkan:
        </label>
        <select
          id="filterSelect"
          value={filter}
          onChange={handleFilterChange}
          className="border p-2"
        >
          <option value="semua">Semua Staff</option>
          <option value="dokter">Dokter</option>
          <option value="perawat">Perawat</option>
        </select>
      </div>

      {/* Jika masih loading data */}
      {loading ? (
        <p className="text-white">Loading data...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-white">No records found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-gray-800 text-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Spesialis</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={`${item.id}-${index}`} className="border-b">
                  <td className="py-2 px-4">{item.id}</td>
                  <td className="py-2 px-4">{item.name}</td>
                  <td className="py-2 px-4">{item.spesialis}</td>
                  <td className="py-2 px-4 capitalize">{item.role}</td>
                  <td className="py-2 px-4">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={30}
                        height={30}
                        className="rounded-full h-auto w-auto"
                        priority
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/no-image.png";
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                      onClick={() => handleDeleteClick(item)}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Konfirmasi Delete */}
      {itemToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-slate-700 p-6 rounded shadow-md max-w-md w-full relative">
            <h2 className="text-xl font-bold mb-4 text-white">Konfirmasi Hapus</h2>
            <p className="text-white mb-4">
              Apakah Anda yakin akan menghapus record dengan ID {itemToDelete.id}?
            </p>

            {/* Spinner saat isDeleting */}
            {isDeleting && (
              <div className="absolute top-4 right-4">
                <Spinner />
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                disabled={isDeleting}
              >
                Hapus
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                disabled={isDeleting}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
