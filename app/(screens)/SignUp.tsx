import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, useColorScheme, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { saveSecureData } from '../../storage/secureStore';

export default function SignUp() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Show password toggle
  const [showRetypePassword, setShowRetypePassword] = useState(false); // Show retype password toggle

  const handleSignUp = async () => {
    // Basic Validations
    if (!fullName || !username || !phoneNumber || !email || !password || !retypePassword) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (password !== retypePassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Password Error', 'Password must be at least 6 characters.');
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      // Saving data securely
      await saveSecureData(`${username}_fullName`, fullName);
      await saveSecureData(`${username}_username`, username);
      await saveSecureData(`${username}_phoneNumber`, phoneNumber);
      await saveSecureData(`${username}_email`, email);
      await saveSecureData(`${username}_password`, password);

      alert('Account created successfully!');
      router.replace('/Login');
    } catch (error) {
      console.error('Error saving credentials:', error);
      alert('Failed to create account. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} translucent backgroundColor="transparent" />
      <View style={styles.topSection}>
        <Image source={require('../../assets/images/babel-x-logo.jpg')} style={styles.logo} />
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.title}>Sign Up</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#333" style={styles.icon} />
          <TextInput placeholder="Full Name" style={styles.input} placeholderTextColor="#000" value={fullName} onChangeText={setFullName} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#333" style={styles.icon} />
          <TextInput placeholder="Username" style={styles.input} placeholderTextColor="#000" value={username} onChangeText={setUsername} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#333" style={styles.icon} />
          <TextInput placeholder="Phone Number" style={styles.input} placeholderTextColor="#000" value={phoneNumber} onChangeText={setPhoneNumber} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#333" style={styles.icon} />
          <TextInput placeholder="Email" style={styles.input} placeholderTextColor="#000" value={email} onChangeText={setEmail} />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
          <TextInput
            placeholder="Password"
            style={styles.input}
            placeholderTextColor="#000"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#333" style={styles.icon} />
          <TextInput
            placeholder="Retype Password"
            style={styles.input}
            placeholderTextColor="#000"
            secureTextEntry={!showRetypePassword}
            value={retypePassword}
            onChangeText={setRetypePassword}
          />
          <TouchableOpacity onPress={() => setShowRetypePassword(!showRetypePassword)} style={styles.eyeIcon}>
            <Ionicons name={showRetypePassword ? 'eye' : 'eye-off'} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/Login')}>
          <Text style={styles.signInLink}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1f3342' },
  topSection: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottomSection: {
    flex: 2.2,
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
    marginBottom: 15,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, paddingVertical: 8 },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
  },
  signInLink: { textAlign: 'center', marginTop: 10, color: '#1f3342' },
  signupButton: {
    backgroundColor: '#4f75c2',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
