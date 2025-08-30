import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-remove after duration
    setTimeout(() => {
      hideToast(id);
    }, toast.duration || 5000);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircleIcon;
      case 'error': return XCircleIcon;
      case 'warning': return ExclamationTriangleIcon;
      case 'info': return InformationCircleIcon;
      default: return InformationCircleIcon;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500/20 bg-green-500/10 text-green-400';
      case 'error': return 'border-red-500/20 bg-red-500/10 text-red-400';
      case 'warning': return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400';
      case 'info': return 'border-stabilizer-cyan/20 bg-stabilizer-cyan/10 text-stabilizer-cyan';
      default: return 'border-quantum-ember/20 bg-quantum-ember/10 text-quantum-ember';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = getIcon(toast.type);
            const colors = getColors(toast.type);
            
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 300, scale: 0.3 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`max-w-sm w-full bg-charcoal border rounded-lg shadow-xl p-4 ${colors}`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{toast.title}</p>
                    {toast.message && (
                      <p className="text-sm opacity-90 mt-1">{toast.message}</p>
                    )}
                  </div>
                  <button
                    onClick={() => hideToast(toast.id)}
                    className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};