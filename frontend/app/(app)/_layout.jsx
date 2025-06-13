import { Slot, Redirect } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function AppLayout() {
  const { isLoggedIn, loading } = useAuth();

  // Redirect to login if not authenticated
  if (!loading && !isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return <Slot />;
}