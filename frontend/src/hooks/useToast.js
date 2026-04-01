import toast from 'react-hot-toast';

/**
 * Thin wrapper around react-hot-toast
 */
export const useToast = () => ({
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  loading: (msg) => toast.loading(msg),
  dismiss: () => toast.dismiss(),
});
