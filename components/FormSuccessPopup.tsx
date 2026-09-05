'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

export function FormSuccessPopup({
  show,
  onClose,
  message = 'Form submitted successfully!',
  autoCloseTime = 3000,
}: {
  show: boolean;
  onClose: () => void;
  message?: string;
  autoCloseTime?: number;
}) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseTime);
      
      return () => clearTimeout(timer);
    }
  }, [show, onClose, autoCloseTime]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-white/95 rounded-2xl flex flex-col items-center justify-center z-50"
        >
          <div className="flex flex-col items-center text-center px-6">
            <FaCheckCircle className="text-5xl text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: autoCloseTime / 1000, ease: "linear" }}
                className="bg-green-500 h-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 