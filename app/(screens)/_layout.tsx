import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="screens/Onboarding" />
      <Stack.Screen name="screens/Welcome" />
      <Stack.Screen name="screens/Login" />
      <Stack.Screen name="screens/SignUp" />
      <Stack.Screen name="screens/Home"/>
      <Stack.Screen name="screens/Favorites" />
      <Stack.Screen name="screens/History" />
      <Stack.Screen name="screens/Settings" />
      <Stack.Screen name="screens/EditProfile" />
      <Stack.Screen name="screens/YourActivity" />
      <Stack.Screen name="screens/PasswordSecurity" />
      <Stack.Screen name="screens/ThemeSettings" />
      <Stack.Screen name="screens/Notifications" />
      <Stack.Screen name="screens/PrivacySettings" />
      <Stack.Screen name="screens/LanguageSettings" />
      <Stack.Screen name="screens/Help" />
    </Stack>
  );
}
