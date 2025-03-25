"use client";
import { useEffect, useState } from "react";
import ModalComponent from "@/components/multipel-sheets/modal-component";

interface DataType {
  date: string;
  namaPasien: string;
  nomorRekamMedis: string;
  namaDokter: string;
  jenisBius: string;
  jaminanOperasi: string;
  tindakanOperasi: string;
  teamOperasi: string;
  ruangOperasi: string;
}

export default function Table() {
  const [data, setData] = useState<{ [key: string]: DataType[] }>({});
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<DataType>({
    date: "",
    namaPasien: "",
    nomorRekamMedis: "",
    namaDokter: "",
    jenisBius: "",
    jaminanOperasi: "",
    tindakanOperasi: "",
    teamOperasi: "",
    ruangOperasi: "",
  });

  // Fetch data dari API
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

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Gagal menyimpan data");

      const newData = await response.json();

      // Update data setelah menambahkan data baru
      setData((prevData) => ({
        ...prevData,
        [newData.sheet]: [...(prevData[newData.sheet] || []), newData.data],
      }));

      setIsModalOpen(false);
      setFormData({
        date: "",
        namaPasien: "",
        nomorRekamMedis: "",
        namaDokter: "",
        jenisBius: "",
        jaminanOperasi: "",
        tindakanOperasi: "",
        teamOperasi: "",
        ruangOperasi: "",
      });
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;

  return (
    <div className="p-4 bg-slate-500">
      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Tambah Data
      </button>

      {/* Modal untuk form */}
      <ModalComponent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2 className="text-lg font-bold mb-4 text-slate-500">Tambah Data</h2>
        <form onSubmit={handleSubmit} className="space-y-3 ">
          <input
            type="date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full border p-2  rounded-lg text-slate-500"
          />
          <input
            type="text"
            placeholder="Nama Pasien"
            value={formData.namaPasien}
            onChange={(e) =>
              setFormData({ ...formData, namaPasien: e.target.value })
            }
            className="w-full border p-2  rounded-lg text-slate-500"
          />
          <input
            type="text"
            placeholder="Nomor Rekam Medis"
            value={formData.nomorRekamMedis}
            onChange={(e) =>
              setFormData({ ...formData, nomorRekamMedis: e.target.value })
            }
            className="w-full border p-2  rounded-lg text-slate-500"
          />
          <input
            type="text"
            placeholder="Nama Dokter"
            value={formData.namaDokter}
            onChange={(e) =>
              setFormData({ ...formData, namaDokter: e.target.value })
            }
            className="w-full border p-2  rounded-lg text-slate-500"
          />
          <input
            type="text"
            placeholder="Jenis Bius"
            value={formData.jenisBius}
            onChange={(e) =>
              setFormData({ ...formData, jenisBius: e.target.value })
            }
            className="w-full border p-2  rounded-lg text-slate-500"
          />
          <input
            type="text"
            placeholder="Jaminan Operasi"
            value={formData.jaminanOperasi}
            onChange={(e) =>
              setFormData({ ...formData, jaminanOperasi: e.target.value })
            }
            className="w-full border p-2  rounded-lg text-slate-500"
          />
          <input
            type="text"
            placeholder="Tindakan Operasi"
            value={formData.tindakanOperasi}
            onChange={(e) =>
              setFormData({ ...formData, tindakanOperasi: e.target.value })
            }
            className="w-full border p-2  rounded-lg text-slate-500"
          />
          <input
            type="text"
            placeholder="Team Operasi"
            className="w-full border p-2  rounded-lg text-slate-500"
          />
          <input
            type="text"
            placeholder="Ruang Operasi"
            value={formData.ruangOperasi}
            onChange={(e) =>
              setFormData({ ...formData, ruangOperasi: e.target.value })
            }
            className="w-full border p-2  rounded-lg text-slate-500"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2  rounded-lg "
            >
              Simpan
            </button>
            <button
              type="reset"
              className="bg-blue-500 text-white px-4 py-2  rounded-lg"
            >
              Reset
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2  rounded-lg"
              onClick={() => setIsModalOpen(false)}
            >
              Keluar
            </button>
          </div>
        </form>
      </ModalComponent>

      {/* Tabel Data */}
      {Object.entries(data).map(([sheetName, records]) => (
        <div key={sheetName} className="mb-8">
          <h2 className="text-xl font-bold mb-2">{sheetName}</h2>
          <div className="overflow-x-auto">
            <table className="table-auto border-collapse border w-full text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2">Nama Pasien</th>
                  <th className="border px-4 py-2">Nomor Rekam Medis</th>
                  <th className="border px-4 py-2">Dokter</th>
                  <th className="border px-4 py-2">Jenis Bius</th>
                </tr>
              </thead>
              <tbody>
                {records.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{item.namaPasien}</td>
                    <td className="border px-4 py-2">{item.nomorRekamMedis}</td>
                    <td className="border px-4 py-2">{item.namaDokter}</td>
                    <td className="border px-4 py-2">{item.jenisBius}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
