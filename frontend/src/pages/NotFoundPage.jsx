import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import Button from '@/components/ui/Button.jsx';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6">
        <ShieldOff className="w-10 h-10 text-slate-500" />
      </div>
      <h1 className="text-6xl font-bold text-white mb-3">404</h1>
      <p className="text-lg text-slate-400 mb-2">Page not found</p>
      <p className="text-sm text-slate-500 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button variant="primary" onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </Button>
    </div>
  );
}
