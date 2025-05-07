import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, useColorScheme, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage
import { saveSecureData, getSecureData } from '../../storage/secureStore';  // Assuming getSecureData is available
import { loginUser } from '../../storage/secureStore';

export default function Login() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Validation Error', 'Please enter both username and password.');
      return;
    }
  
    // Use actual authentication check
    const isAuthenticated = await loginUser(username, password);
  
    if (isAuthenticated) {
      // Store session data if login is valid
      await AsyncStorage.setItem('username', username);
  
      const storedFullName = await getSecureData(`${username}_fullName`);
      const storedEmail = await getSecureData(`${username}_email`);
      const storedPhoneNumber = await getSecureData(`${username}_phoneNumber`);
  
      router.push('/Home');
    } else {
      Alert.alert('Authentication Failed', 'Invalid username or password.');
    }
  };

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
          <TextInput
            placeholder="Username"
            placeholderTextColor="#000"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#000"
            secureTextEntry={!showPassword} // Toggle visibility based on state
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)} // Toggle show password
          >
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.forgotPassword}>Forgot Password?</Text>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
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
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
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
