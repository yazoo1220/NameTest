// /components/ui/use-toast.tsx
import React from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from './toast';  // Toastコンポーネントがある場合、インポート

interface ToastContextType {
  toast: (message: string, variant?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<{ message: string; variant: string }[]>([]);

  const toast = (message: string, variant: 'success' | 'error' | 'info' = 'info') => {
    setToasts([...toasts, { message, variant }]);

    setTimeout(() => {
      setToasts((toasts) => toasts.slice(1));  // 自動的にトーストを消す
    }, 3000);  // 3秒で消える
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-0 right-0 p-4">
        {toasts.map((toast, index) => (
          <Toast key={index} message={toast.message} variant={toast.variant} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
