import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore.js';
import { ROUTES } from '@/utils/constants.js';

/**
 * Hook for auth state and actions
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, logout: storeLogout } = useAuthStore();

  const logout = () => {
    storeLogout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return { user, token, isAuthenticated, logout, requireAuth };
};
