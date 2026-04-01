import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react';
import Input from '@/components/ui/Input.jsx';
import Button from '@/components/ui/Button.jsx';
import { loginSchema } from '@/utils/validators.js';
import { loginUser } from '@/api/auth.api.js';
import { useAuthStore } from '@/store/authStore.js';
import { useToast } from '@/hooks/useToast.js';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    setLoading(true);
    setApiError('');
    try {
      const { user, token } = await loginUser(values.email, values.password);
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setValue('email', 'demo@flowshield.io');
    setValue('password', 'Demo1234');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Sign in</h2>
        <p className="text-sm text-slate-400 mt-1">Welcome back to FlowShield</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          register={register}
          error={errors.email?.message}
          icon={Mail}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Your password"
          register={register}
          error={errors.password?.message}
          icon={Lock}
        />

        {apiError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
            {apiError}
          </div>
        )}

        <Button variant="primary" fullWidth type="submit" loading={loading} size="lg">
          Sign in
        </Button>
      </form>

      <div className="space-y-3 text-center">
        <p className="text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Create one
          </Link>
        </p>
        <button
          type="button"
          onClick={fillDemo}
          className="text-xs text-slate-500 hover:text-slate-400 transition-colors underline underline-offset-2"
        >
          Fill demo credentials
        </button>
      </div>
    </div>
  );
}
