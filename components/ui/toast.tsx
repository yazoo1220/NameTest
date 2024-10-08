"use client";

import React, { createContext, useContext, useState } from 'react';

// Define the ToastContext type
interface ToastContextType {
  addToast: (toast: ToastProps) => void;
  removeToast: (index: number) => void;
  toasts: ToastProps[];
}

// Use the correct type for the context
const ToastContext = createContext<ToastContextType | null>(null);

// Create the ToastProvider component
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: ToastProps) => {
    setToasts((prevToasts) => [...prevToasts, toast]);
  };

  const removeToast = (index: number) => {
    setToasts((prevToasts) => prevToasts.filter((_, i) => i !== index));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4 space-y-2">
        {toasts.map((toast, index) => (
          <Toast key={index} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook to use the toast functionality
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Define the ToastProps type
export interface ToastProps {
  title?: string;
  description: string;
  variant: 'success' | 'error' | 'info' | 'destructive';
}

// Toast component
export const Toast = ({ title, description, variant }: ToastProps) => {
  let backgroundColor = '';
  switch (variant) {
    case 'success':
      backgroundColor = 'bg-green-500';
      break;
    case 'error':
      backgroundColor = 'bg-red-500';
      break;
    case 'info':
      backgroundColor = 'bg-blue-500';
      break;
    case 'destructive':
      backgroundColor = 'bg-red-700';
      break;
    default:
      backgroundColor = 'bg-blue-500';
  }

  return (
    <div className={`p-4 text-white rounded shadow-lg ${backgroundColor}`}>
      {title && <strong>{title}</strong>}
      <p>{description}</p>
    </div>
  );
};
