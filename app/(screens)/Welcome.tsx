import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
const Welcome = () => {
  const router = useRouter();
  const backgroundColor = '#ffffff';
  return (
    <View style={styles.container}>
    <StatusBar style={backgroundColor === '#ffffff' ? 'dark' : 'light'} />
      <Image source={require('../../assets/images/babel-x-logo-nbg.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Welcome to BabelX</Text>
      <Text style={styles.subtitle}>Translate instantly with text, voice, and camera. Start your journey now!</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/(screens)/Login')}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} onPress={() => router.push('/(screens)/SignUp')}>
        <Text style={[styles.buttonText, { color: '#333' }]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  logo: { width: 200, height: 200, marginBottom: 30 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#4f75c2', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center', marginBottom: 40 },
  button: { width: '80%', backgroundColor: '#4f75c2', padding: 15, borderRadius: 30, marginBottom: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default Welcome;
