import { motion } from "framer-motion";
import React from "react";
import clsx from "clsx"; // Opsional, untuk mengelola className lebih fleksibel

interface BadgeProps {
  text: string;
  color?: string;
  className?: string; // Tambahkan className agar bisa dikustomisasi
}

const Badge: React.FC<BadgeProps> = ({ text, color = "bg-blue-500", className }) => {
  return (
    <motion.div
      className={clsx(`inline-flex items-center px-3 py-1 rounded-full text-white text-xs font-semibold ${color}`, className)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.1 }}
    >
      {text}
    </motion.div>
  );
};

export default Badge;
