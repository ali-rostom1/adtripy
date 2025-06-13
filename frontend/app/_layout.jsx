import { Slot } from 'expo-router';
import { AuthProvider } from '../src/context/AuthContext';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();
  
  useEffect(() => {
    // Handle deep links
    const handleDeepLink = (event) => {
      const url = event.url;
      
      if (url.includes('reset-password')) {
        const token = extractParamFromUrl(url, 'token');
        const email = extractParamFromUrl(url, 'email');
        router.push({
          pathname: '/reset-password',
          params: { token, email }
        });
      } 
      else if (url.includes('verify-email')) {
        router.push('/verification-success');
      }
    };

    const extractParamFromUrl = (url, param) => {
      const regex = new RegExp(`[?&]${param}=([^&#]*)`);
      const results = regex.exec(url);
      return results && results[1] ? decodeURIComponent(results[1]) : null;
    };

    // Subscribe to deep link events
    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Check for initial URL when app is opened from a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}