import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { Ionicons, Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');
const backgroundColor = '#ffffff';

export default function Home() {
  const colorScheme = useColorScheme();
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('es'); 

  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission Denied', 'Microphone access is required to record.');
        return;
      }
  
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
  
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
  
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };
  
  const stopRecording = async () => {
    try {
      if (!recording) return;
  
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped, file saved at:', uri);
  
      setRecording(null);
  
      if (uri) {
        const formData = new FormData();
        formData.append('file', {
          uri,
          name: 'audio.m4a',
          type: 'audio/m4a',
        } as any); // Avoid TS warning
  
        const response = await fetch('http://192.168.5.227:5000/transcribe', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Make sure the response is valid before using it
        if (!response.ok) {
          throw new Error('Failed to transcribe audio');
        }
  
        const result = await response.json();
  
        // Ensure that result is correctly handled
        const transcript = result.transcript || 'Could not transcribe.';
        setInputText(transcript);
  
        // Now auto-translate the transcript
        const translated = await translateText(transcript, selectedLanguage);
        setTranslatedText(translated);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };
  


  const translateText = async (text: string, targetLanguage: string) => {
    try {
      const response = await fetch('http://192.168.5.157:5000/translate', { // Kali Linux VM's IP address
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: targetLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP Error! Status: ${response.status}, message: ${JSON.stringify(errorData)}`
        );        
      }

      const data = await response.json();
      return data.translatedText ?? 'Translation failed.';
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        Alert.alert('Translation Error', error.message);
      } else {
        Alert.alert('Translation Error', 'An unknown error occurred.');
      }
      return 'Error translating text.';
    }
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Please enter text to translate.');
      return;
    }
    const result = await translateText(inputText, selectedLanguage); // Use selected language
    setTranslatedText(result);
  };

  const switchLanguage = () => {
    setSelectedLanguage((prevLanguage) => (prevLanguage === 'es' ? 'en' : 'es')); // Toggle between 'es' and 'en'
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={backgroundColor === '#ffffff' ? 'dark' : 'light'} />
      <View style={styles.header}>
        <Ionicons name="menu" size={28} color="#fff" />
        <Text style={styles.headerTitle}>Language Translator</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 15 }}>
        <View style={styles.languageSwitch}>
          <Text style={styles.languageText}>{selectedLanguage === 'es' ? 'English' : 'Spanish'}</Text>
          <Ionicons name="swap-horizontal" size={24} color="#000" onPress={switchLanguage} />
          <Text style={styles.languageText}>{selectedLanguage === 'es' ? 'Spanish' : 'English'}</Text>
        </View>

        <View style={styles.textBox}>
          <View style={styles.boxHeader}>
            <Text style={styles.boxHeaderText}>{selectedLanguage === 'es' ? 'English' : 'Spanish'}</Text>
            <Ionicons name="volume-high" size={20} color="#000" />
          </View>
          <TextInput
            placeholder="Type text to translate..."
            placeholderTextColor="#333"
            multiline
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
          />
<View style={styles.boxFooter}>
  <TouchableOpacity onPress={recording ? stopRecording : startRecording} style={styles.micButtonInline}>
    <Ionicons name={recording ? 'stop-circle' : 'mic'} size={28} color="#fff" />
  </TouchableOpacity>

  <TouchableOpacity style={styles.translateButton} onPress={handleTranslate}>
    <Text style={styles.translateText}>Translate</Text>
  </TouchableOpacity>
</View>

        </View>

        <View style={styles.textBox}>
          <View style={styles.boxHeader}>
            <Text style={styles.boxHeaderText}>{selectedLanguage === 'es' ? 'Spanish' : 'English'}</Text>
            <Ionicons name="volume-high" size={20} color="#000" />
          </View>
          <Text style={styles.translatedText}>{translatedText}</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity style={{ marginLeft: 20 }}><Feather name="copy" size={22} color="#000" /></TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }}><MaterialIcons name="share" size={22} color="#000" /></TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }}><FontAwesome name="star-o" size={22} color="#000" /></TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="time-outline" size={22} color="#000" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="star-outline" size={22} color="#000" />
          <Text style={styles.navText}>Favourite</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={recording ? stopRecording : startRecording} style={styles.micButton}>
            <Ionicons name={recording ? 'stop-circle' : 'mic'} size={28} color="#fff" />
          </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a3d62',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { color: '#fff', fontSize: 18, marginLeft: 10, fontWeight: 'bold' },
  languageSwitch: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
    elevation: 1,
  },
  languageText: { fontSize: 16, fontWeight: 'bold' },
  textBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    minHeight: 170,
    justifyContent: 'space-between',
  },
  boxHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  boxHeaderText: { fontWeight: 'bold', fontSize: 16 },
  textInput: { height: 80, textAlignVertical: 'top', color: '#000' },
  boxFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  translateButton: {
    backgroundColor: '#ff6f00',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  translateText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  translatedText: { fontSize: 16, color: '#000', marginBottom: 10 },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    elevation: 10,
  },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 12, marginTop: 5 },
  micButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#0a3d62',
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  micButtonInline: {
    backgroundColor: '#0a3d62',
    borderRadius: 20,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
});