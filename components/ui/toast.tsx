// /components/ui/toast.tsx
import React from 'react';

interface ToastProps {
    message: string;
    variant: 'success' | 'error' | 'info';
  }
  
  export const Toast = ({ message, variant }: ToastProps) => {
    let backgroundColor = '';
    switch (variant) {
      case 'success':
        backgroundColor = 'bg-green-500';
        break;
      case 'error':
        backgroundColor = 'bg-red-500';
        break;
      case 'info':
      default:
        backgroundColor = 'bg-blue-500';
        break;
    }
  
    return (
      <div className={`p-2 text-white rounded shadow-lg ${backgroundColor}`}>
        {message}
      </div>
    );
  };
  