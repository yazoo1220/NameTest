import React from 'react';

export interface ToastProps {
  title?: string;
  description: string;
  variant: 'success' | 'error' | 'info' | 'destructive';
}

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
      backgroundColor = 'bg-red-700';  // より破壊的な印象を与える色
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

