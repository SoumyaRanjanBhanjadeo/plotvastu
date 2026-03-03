'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, LogIn } from 'lucide-react';

export function SessionExpiredModal({ isOpen, onLogin }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-101"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="bg-linear-to-r from-amber-500 to-orange-500 px-6 py-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Session Expired
                </h2>
                <p className="text-amber-100">
                  Your session has expired. Please login again.
                </p>
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  For security reasons, you have been logged out due to inactivity.
                </p>

                <button
                  onClick={onLogin}
                  className="w-full py-3 bg-gray-900 dark:bg-blue-600 text-white rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-5 h-5" />
                  Login Again
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
