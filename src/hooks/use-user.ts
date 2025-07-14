
import { useAuth } from '@/context/auth-context';

export function useUser() {
  const { user, profile, loading } = useAuth();
  return { user, profile, loading };
}
