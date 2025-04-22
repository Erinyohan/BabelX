import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, useColorScheme } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function SignUp() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
    <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} translucent backgroundColor="transparent" />
      <View style={styles.topSection}>
        <Image source={require('../../assets/images/babel-x-logo.jpg')} style={styles.logo} />
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.title}>Sign Up</Text>
        {[
          { placeholder: 'Full Name',  icon: 'person-outline' },
          { placeholder: 'Username', icon: 'person-outline' },
          { placeholder: 'Phone Number', icon: 'call-outline' },
          { placeholder: 'Email', icon: 'mail-outline' },
          { placeholder: 'Password', icon: 'lock-closed-outline', secure: true },
        ].map((field, index) => (
          <View key={index} style={styles.inputContainer}>
            <Ionicons name={field.icon as any} size={20} color="#333" style={styles.icon} />
            <TextInput
              placeholder={field.placeholder}
              placeholderTextColor="#000"
              secureTextEntry={field.secure}
              style={styles.input}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.signupButton} onPress={() => console.log('Sign Up Pressed')}>
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
