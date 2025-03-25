"use client";

import { ChangeEvent, useState } from "react";
import { motion } from "framer-motion";

interface InputFieldProps {
  label: string;
  type?: string;
  name: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  // Tambahkan id (opsional). Jika tidak ada, kita pakai 'name'.
  id?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function InputField({
  label,
  type = "text",
  name,
  value,
  placeholder,
  required = false,
  id,
  onChange,
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Jika prop id tidak disediakan, gunakan name agar tetap unik
  const inputId = id || name;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="block text-md font-medium text-gray-200 mb-1">
        {label}
      </label>
      <motion.input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="w-full p-2 border rounded-lg focus:ring-2"
        animate={{
          outlineColor: isFocused ? ["#FF5733", "#33FF57", "#3357FF"] : "#FF5733",
          outlineWidth: isFocused ? "17px" : "9px",
          scale: value ? 1.05 : 1,
        }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
    </div>
  );
}
