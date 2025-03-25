"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "../ui/Badge";

interface DropdownBadgeGroupProps {
  date: string;
  bius: string;
}

/**
 * Komponen menampilkan 3 badge (date, bius, team).
 * - Layar > 450px: badge inline (flex).
 * - Layar ≤ 450px: tombol => dropdown badge.
 */
export default function DropdownBadgeGroup({
  date,
  bius
}: DropdownBadgeGroupProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-0">
      {/* Layar > 450px: tampilkan 3 badge inline */}
      <div className="flex flex-wrap gap-2 max-[420px]:hidden">
        <Badge text={date} color="bg-green-500" />
        <Badge text={`Bius: ${bius}`} color="bg-blue-500" />
      </div>

      {/* Layar ≤ 450px: tombol => dropdown */}
      <div className="hidden max-[420px]:block relative">
        <button
          onClick={() => setOpen(!open)}
          className="bg-slate-700 px-2 py-1 rounded-lg text-xs text-white"
        >
          Lihat Info
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 mt-2 bg-white border border-gray-300 rounded shadow p-2 z-50 w-44"
            >
              <div className="flex flex-col gap-2">
                <Badge text={date} color="bg-green-500" />
                <Badge text={`Bius: ${bius}`} color="bg-blue-500" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
