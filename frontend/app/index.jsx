// filepath: c:\laragon\www\adtripy\frontend\app\index.jsx
import { Redirect } from 'expo-router';
import useAuthStore from '../src/store/useAuthStore';
import { View, ActivityIndicator, useEffect } from 'react-native';

export default function Index() {
  const { isLoggedIn, loading, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  // If logged in, redirect to home screen
  return <Redirect href="/home" />;
}