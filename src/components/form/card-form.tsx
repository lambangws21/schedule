"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UploadForm from '@/components/form/form-input';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';



const CardForm = () => {
  const [formOpen, setFormOpen] = useState(false);

  const toggleForm = () => setFormOpen((prev) => !prev);

  return (
    <div className="max-w-md mx-auto p-4 rounded- shadow-sm bg-slate-200/70">
      <div className="mt-4 flex justify-start">
        <Button onClick={toggleForm} className="flex items-center gap-2 rounded-full">
          <Plus size={20} className="text-blue-500 bg-yellow-50 rounded-lg" />
        </Button>
      </div>
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-4 overflow-hidden"
          >
            <UploadForm
              onUpload={() => setFormOpen(false)}
              editData={null}
            />

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CardForm;
