import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={`
                pointer-events-auto
                flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl min-w-[300px]
                backdrop-blur-md border border-white/20
                ${toast.type === 'success' ? 'bg-gradient-to-r from-emerald-500/90 to-teal-600/90 text-white' : ''}
                ${toast.type === 'error' ? 'bg-gradient-to-r from-rose-500/90 to-red-600/90 text-white' : ''}
                ${toast.type === 'info' ? 'bg-gradient-to-r from-blue-500/90 to-indigo-600/90 text-white' : ''}
              `}
            >
              <div className="text-2xl">
                {toast.type === 'success' && <FaCheckCircle />}
                {toast.type === 'error' && <FaExclamationCircle />}
                {toast.type === 'info' && <FaInfoCircle />}
              </div>
              <div className="flex-1 font-bold tracking-wide text-sm">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <FaTimes className="text-xs" />
              </button>

              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 4, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
