import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="screens/Onboarding" />
      <Stack.Screen name="screens/Welcome" />
      <Stack.Screen name="screens/Login" />
      <Stack.Screen name="screens/SignUp" />
      <Stack.Screen name="screens/Home" />
    </Stack>
  );
}
