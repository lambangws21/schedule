"use client";

import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";

interface AnimatedSelectProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  className?: string;
}

export default function AnimatedSelect({
  label,
  id,
  value,
  onChange,
  options,
  className = "",
}: AnimatedSelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-md font-medium text-slate-200">
        {label}
      </label>
      <motion.select
        id={id}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        // Kelas dasar (Tailwind) + kelas opsional dari props
        className={`mt-1 block p-3 w-full border border-gray-300  rounded-md shadow-sm focus:outline-none ${className}`}
        // Animasi mirip input
        animate={{
          outlineColor: isFocused ? ["#FF5733", "#33FF57", "#3357FF"] : "#FF5733",
          outlineWidth: isFocused ? "15px" : "7px",
          scale: isFocused ? 1.05 : 1,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </motion.select>
    </div>
  );
}
