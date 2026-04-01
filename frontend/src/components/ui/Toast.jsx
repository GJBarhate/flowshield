import { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle } from 'lucide-react';

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      gutter={8}
      toastOptions={{
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          border: '1px solid #334155',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          borderRadius: '10px',
          padding: '12px 16px',
        },
        success: {
          icon: <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />,
          duration: 3000,
        },
        error: {
          icon: <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
          duration: 4500,
        },
      }}
    />
  );
}
