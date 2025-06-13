import { Stack, Redirect } from 'expo-router';
import { useEffect } from 'react';
import useAuthStore from '../../src/store/useAuthStore';

export default function AppLayout() {
  const { isLoggedIn, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: true, title: "Home" }} />
      <Stack.Screen name="profile" options={{ headerShown: true, title: "Profile" }} />
      {/* Add other authenticated route screens here */}
    </Stack>
  );
}