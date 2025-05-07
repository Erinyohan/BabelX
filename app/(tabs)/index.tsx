import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { getSecureData } from '../../storage/secureStore'; 
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSecureData('session');
      setIsLoggedIn(session === 'active');
      setIsLoading(false);
    };

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={isLoggedIn ? '/Home' : '/(screens)/Onboarding'} />;
}
