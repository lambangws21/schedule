"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={onCancel}
          ></div>
          {/* Modal content */}
          <motion.div
            className="bg-slate-700 p-6 rounded shadow-lg z-10 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            {title && (
              <h2 className="text-xl font-semibold mb-4">{title}</h2>
            )}
            <p className="mb-4">{message}</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-300 rounded"
                onClick={onCancel}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={onConfirm}
              >
                Konfirmasi
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
