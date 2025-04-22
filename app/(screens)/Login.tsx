import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


export default function Login() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} translucent backgroundColor="transparent" />
      <View style={styles.topSection}>
        <Image source={require('../../assets/images/babel-x-logo.jpg')} style={styles.logo} />
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#333" style={styles.icon} />
          <TextInput placeholder="Username" placeholderTextColor="#000" style={styles.input} />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
          <TextInput placeholder="Password" placeholderTextColor="#000" secureTextEntry style={styles.input} />
        </View>
        <Text style={styles.forgotPassword}>Forget Password?</Text>

        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/Home')}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/SignUp')}>
          <Text style={styles.signUpLink}>Sign Up Here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1f3342' },
  topSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottomSection: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  logo: { width: 150, height: 150, resizeMode: 'contain' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f3342', alignSelf: 'center', marginVertical: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 8 },
  forgotPassword: { textAlign: 'right', color: '#888', marginBottom: 20 },
  loginButton: {
    backgroundColor: '#4f75c2',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  loginButtonText: { color: '#fff', fontSize: 18 },
  signUpLink: { textAlign: 'center', marginTop: 20, color: '#1f3342' },
});
