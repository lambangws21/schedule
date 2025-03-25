"use client";

import React, { useState } from "react";

// Misalnya, tipe DataItem didefinisikan seperti berikut (sesuaikan jika perlu)
export interface DataItem {
  id: number;
  name: string;
  spesialis: string;
  googleDriveID: string;
  imageUrl: string;
  role: "dokter" | "perawat";
  targetSheet: "Sheet5" | "Sheet6";
}

interface StaffEditFormProps {
  initialData: DataItem;
  onSave: (updatedData: DataItem) => void;
  onCancel: () => void;
}

export default function StaffEditForm({ initialData, onSave, onCancel }: StaffEditFormProps) {
  const [name, setName] = useState<string>(initialData.name);
  const [spesialis, setSpesialis] = useState<string>(initialData.spesialis);
  // Anda dapat menambahkan field lain sesuai kebutuhan

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedData: DataItem = { ...initialData, name, spesialis };
    onSave(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 text-white rounded max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Staff</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="spesialis" className="block mb-1">Spesialis:</label>
        <input
          id="spesialis"
          type="text"
          value={spesialis}
          onChange={(e) => setSpesialis(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 border border-gray-600"
        />
      </div>
      <div className="flex space-x-2">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
