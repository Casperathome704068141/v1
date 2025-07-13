
import { useAuth } from '@/context/auth-context';

export function useUser() {
  const { user, loading } = useAuth();
  return { user, loading };
}
