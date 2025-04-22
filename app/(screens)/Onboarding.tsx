import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');
const backgroundColor = '#ffffff';
const Onboarding = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace('/(screens)/Welcome'); // adjust path as needed
  };

  return (
    
    <Swiper loop={false} showsPagination={true} dotColor="#ccc" activeDotColor="#4f75c2">
    
        
      {/* Screen 1 */}
      <View style={styles.slide}>
      <StatusBar style={backgroundColor === '#ffffff' ? 'dark' : 'light'} />
        <Image source={require('../../assets/images/babel-x-logo-nbg.png')} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>Welcome to BabelX</Text>
        <Text style={styles.text}>Your smart language companion for text and voice translations.</Text>
      </View>

      {/* Screen 2 */}
      <View style={styles.slide}>
        <Image source={require('../../assets/images/babel-x-logo.jpg')} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>Translate Instantly</Text>
        <Text style={styles.text}>Simply enter text, select the language, and get instant translations.</Text>
      </View>

      {/* Screen 3 */}
      <View style={styles.slide}>
        <Image source={require('../../assets/images/babel-x-logo-nbg.png')} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>Use Voice</Text>
        <Text style={styles.text}>Speak for real-time translations on the go.</Text>
        <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: width * 0.7,
    height: height * 0.4,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4f75c2',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#4f75c2',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Onboarding;
