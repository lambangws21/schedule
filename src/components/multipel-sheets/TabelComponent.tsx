"use client";
import { useEffect, useState } from "react";

interface DataType {
  no: string;
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/sheets");
      const result = await response.json();
      setData(result.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {Object.entries(data).map(([sheetName, records]) => (
        <div key={sheetName}>
          <h2 className="text-lg font-bold">{sheetName}</h2>
          <table className="table-auto border-collapse border">
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Nama Pasien</th>
                <th>Nomor Rekam Medis</th>
                <th>Dokter</th>
                <th>Jenis Bius</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item) => (
                <tr key={item.no}>
                  <td>{item.no}</td>
                  <td>{item.date}</td>
                  <td>{item.namaPasien}</td>
                  <td>{item.nomorRekamMedis}</td>
                  <td>{item.namaDokter}</td>
                  <td>{item.jenisBius}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
