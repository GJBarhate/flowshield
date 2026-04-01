import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock } from 'lucide-react';
import Input from '@/components/ui/Input.jsx';
import Button from '@/components/ui/Button.jsx';
import { registerSchema } from '@/utils/validators.js';
import { registerUser } from '@/api/auth.api.js';
import { useAuthStore } from '@/store/authStore.js';
import { useToast } from '@/hooks/useToast.js';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values) => {
    setLoading(true);
    setApiError('');
    try {
      const { user, token } = await registerUser(values.name, values.email, values.password);
      setAuth(user, token);
      toast.success('Account created! Welcome to FlowShield.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Create account</h2>
        <p className="text-sm text-slate-400 mt-1">Start protecting your webhooks today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Full Name"
          name="name"
          placeholder="Jane Doe"
          register={register}
          error={errors.name?.message}
          icon={User}
        />
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
          placeholder="Min 8 chars, uppercase + number"
          register={register}
          error={errors.password?.message}
          icon={Lock}
        />
        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          register={register}
          error={errors.confirmPassword?.message}
          icon={Lock}
        />

        {apiError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
            {apiError}
          </div>
        )}

        <Button variant="primary" fullWidth type="submit" loading={loading} size="lg">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
