import React, { useState, useEffect  } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert, TouchableWithoutFeedback  } from 'react-native';
import { Ionicons, Feather, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Audio } from 'expo-av';
import RNPickerSelect from 'react-native-picker-select';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


const { width } = Dimensions.get('window');
const backgroundColor = '#ffffff';

// Define the type for each history item
type HistoryItem = {
  id: string;
  from: string;
  to: string;
  inputText: string;
  translatedText: string;
  isFavorite?: boolean; 
};

// Load data from AsyncStorage
const loadHistory = async (username: string) => {
  const historyData = await AsyncStorage.getItem(`${username}_history`);
  const deletedHistoryData = await AsyncStorage.getItem(`${username}_deletedHistory`);
  
  const history = historyData ? JSON.parse(historyData) : [];
  const deletedHistory = deletedHistoryData ? JSON.parse(deletedHistoryData) : [];

  // Filter out deleted history items
  return history.filter((item: HistoryItem) => !deletedHistory.includes(item.id));
};


// Save data to AsyncStorage
const saveHistory = async (username: string, history: HistoryItem[]) => {
  await AsyncStorage.setItem(`${username}_history`, JSON.stringify(history));
};
const loadFavorites = async (username: string) => {
  const data = await AsyncStorage.getItem(`${username}_favorites`);
  return data ? JSON.parse(data) : [];
};

const saveFavorites = async (username: string, favorites: HistoryItem[]) => {
  await AsyncStorage.setItem(`${username}_favorites`, JSON.stringify(favorites));
};

export default function Home() {
  const colorScheme = useColorScheme();
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('es'); 
  const pickerRef = React.useRef<any>(null);
  const pickerRefs = React.useRef<any>(null);
  const router = useRouter();
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  // Fetch username from AsyncStorage
  useEffect(() => {
    const getUsernameFromStorage = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        } else {
          Alert.alert('Session Error', 'No active session found. Please log in again.');
          router.push('/'); // Or navigate to login page
        }
      } catch (error) {
        console.error('Error retrieving username:', error);
      } finally {
        setLoading(false);
      }
    };

    getUsernameFromStorage();
  }, []);

  // Load history after username is loaded
  useEffect(() => {
    if (!username) return;
    const fetchHistory = async () => {
      const loadedHistory = await loadHistory(username);
      setHistory(loadedHistory);
    };
    fetchHistory();
  }, [username]);

  useFocusEffect(
    React.useCallback(() => {
      const refreshData = async () => {
        if (username) {
          const updatedHistory = await loadHistory(username);
          setHistory(updatedHistory);
        }
      };
      refreshData();
    }, [username])
  );


  useEffect(() => {
    if (username) {
      saveHistory(username, history);
    }
  }, [history, username]);

  const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    zh: 'Chinese',
    ja: 'Japanese',
    hi: 'Hindi',
    ar: 'Arabic',
  };
  
  const addToHistory = async (
    inputText: string,
    translatedText: string,
    inputLang: string,
    outputLang: string
  ) => {
    const newHistoryItem: HistoryItem = {
      id: Date.now().toString(),
      from: languageNames[inputLang] || inputLang,
      to: languageNames[outputLang] || outputLang,
      inputText,
      translatedText,
    };
  
    // Check if the translation has been deleted before
    const deletedHistoryData = await AsyncStorage.getItem(`${username}_deletedHistory`);
    const deletedHistoryArray = deletedHistoryData ? JSON.parse(deletedHistoryData) : [];
  
    // If the new item was deleted before, don't add it again
    if (deletedHistoryArray.some((id: string) => id === newHistoryItem.id)) {
      console.log('This item was deleted before, skipping addition');
      return; // Skip adding it to history
    }
  
    // Add the new item to the history state and save to AsyncStorage
    const updatedHistory = [newHistoryItem, ...history];
    setHistory(updatedHistory);
  
    if (username) {
      await saveHistory(username, updatedHistory); // Save to AsyncStorage
    }
  };
  

  
  const toggleFavorite = async (item: HistoryItem) => {
  if (!username) return;

  const updatedItem = { ...item, isFavorite: !item.isFavorite };

  // Update local history with the favorite toggle
  const updatedHistory = history.map((h) => (h.id === item.id ? updatedItem : h));
  setHistory(updatedHistory);
  await saveHistory(username, updatedHistory);

  // Load existing favorites from AsyncStorage
  const existingFavorites = await loadFavorites(username);
  const isAlreadyFavorite = existingFavorites.some((fav: HistoryItem) => fav.id === item.id);

  let updatedFavorites;
  if (isAlreadyFavorite) {
    // Remove from favorites if already marked as favorite
    updatedFavorites = existingFavorites.filter((fav: HistoryItem) => fav.id !== item.id);
    console.log(`Removed from favorites: ${item.inputText} → ${item.translatedText}`);
  } else {
    // Add to favorites if not already in favorites
    updatedFavorites = [updatedItem, ...existingFavorites];
    console.log(`Added to favorites: ${item.inputText} → ${item.translatedText}`);
  }

  // Save the updated favorites list in AsyncStorage
  await saveFavorites(username, updatedFavorites);
};

  
  

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
        addToHistory(transcript, translated, inputLanguage, outputLanguage);
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
          source: inputLanguage,  // Use selected input language
          target: outputLanguage, // Use selected output language
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
    const result = await translateText(inputText, selectedLanguage);
    console.log('Translated Text:', result); 
    setTranslatedText(result);
    addToHistory(inputText, result, inputLanguage, outputLanguage);
  };


  const switchLanguage = () => {
    setInputLanguage(outputLanguage);
    setOutputLanguage(inputLanguage);
  };
  
  const [inputLanguage, setInputLanguage] = useState('en'); 
  const [outputLanguage, setOutputLanguage] = useState('es'); 
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={backgroundColor === '#ffffff' ? 'dark' : 'light'} />
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/Settings')}>
            <Ionicons name="menu" size={28} color="#fff" />
          </TouchableOpacity>
        <Text style={styles.headerTitle}>BabelX Language Translator</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 15 }}>
      <View style={styles.languageSwitch}>
    {/* Input Language Picker */}
    <View style={styles.pickerWrapper}>
      <TouchableWithoutFeedback onPress={() => pickerRef.current?.togglePicker()}>
        <View pointerEvents="box-only">
          <RNPickerSelect
            ref={pickerRef}
            onValueChange={(value) => setInputLanguage(value)}
            value={inputLanguage}
            items={[
              { label: 'English', value: 'en' },
              { label: 'Spanish', value: 'es' },
              { label: 'French', value: 'fr' },
              { label: 'German', value: 'de' },
              { label: 'Chinese', value: 'zh' },
              { label: 'Japanese', value: 'ja' },
              { label: 'Hindi', value: 'hi' },
              { label: 'Arabic', value: 'ar' },
            ]}
            style={{
              inputIOS: styles.pickerText,
              inputAndroid: styles.pickerText,
              iconContainer: { top: 12, right: 10 },
            }}
            Icon={() => <Ionicons name="chevron-down" size={20} color="gray" />}
            useNativeAndroidPickerStyle={false}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>

    {/* Swap Icon */}
    <Ionicons
      name="swap-horizontal"
      size={24}
      color="#000"
      onPress={switchLanguage}
      style={{ marginLeft: 10 }}
     />

    {/* Output Language Picker */}
    <View style={styles.pickerWrapper}>
      <TouchableWithoutFeedback onPress={() => pickerRefs.current?.togglePicker()}>
        <View pointerEvents="box-only">
          <RNPickerSelect
          ref={pickerRefs}
            onValueChange={(value) => setOutputLanguage(value)}
            value={outputLanguage}
            items={[
              { label: 'English', value: 'en' },
              { label: 'Spanish', value: 'es' },
              { label: 'French', value: 'fr' },
              { label: 'German', value: 'de' },
              { label: 'Chinese', value: 'zh' },
              { label: 'Japanese', value: 'ja' },
              { label: 'Hindi', value: 'hi' },
              { label: 'Arabic', value: 'ar' },
            ]}
            style={{
              inputIOS: styles.pickerText,
              inputAndroid: styles.pickerText,
              iconContainer: { top: 12, right: 10 },
            }}
            Icon={() => <Ionicons name="chevron-down" size={20} color="gray" />}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  </View>


        <View style={styles.textBox}>
          <View style={styles.boxHeader}>
            <Text style={styles.boxHeaderText}>
              {/* Dynamically change the header text based on selected input language */}
              {inputLanguage === 'es' ? 'Spanish' :
              inputLanguage === 'fr' ? 'French' :
              inputLanguage === 'de' ? 'German' :
              inputLanguage === 'zh' ? 'Chinese' :
              inputLanguage === 'ja' ? 'Japanese' :
              inputLanguage === 'hi' ? 'Hindi' :
              inputLanguage === 'ar' ? 'Arabic' :
              'English'}
            </Text>
            <Ionicons name="volume-high" size={20} color="#000" />
          </View>
          <TextInput
            placeholder={
              inputLanguage === 'es' ? 'Escriba texto...' :
              inputLanguage === 'fr' ? 'Tapez le texte à traduire...' :
              inputLanguage === 'de' ? 'Text zum Übersetzen eingeben...' :
              inputLanguage === 'zh' ? '输入要翻译的文本...' :
              inputLanguage === 'ja' ? '翻訳するテキストを入力してください...' :
              inputLanguage === 'hi' ? 'अनुवाद करने के लिए पाठ लिखें...' :
              inputLanguage === 'ar' ? 'اكتب النص للترجمة...' :
              'Type text to translate...'
            }            
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
            <Text style={styles.boxHeaderText}>
              {/* Dynamically change the header text based on selected output language */}
              {outputLanguage === 'es' ? 'Spanish' :
              outputLanguage === 'fr' ? 'French' :
              outputLanguage === 'de' ? 'German' :
              outputLanguage === 'zh' ? 'Chinese' :
              outputLanguage === 'ja' ? 'Japanese' :
              outputLanguage === 'hi' ? 'Hindi' :
              outputLanguage === 'ar' ? 'Arabic' :
              'English'}
            </Text>
            <Ionicons name="volume-high" size={20} color="#000" />
          </View>
          <Text style={styles.translatedText}>{translatedText}</Text>
          <View style={styles.iconRow}>
            <TouchableOpacity style={{ marginLeft: 20 }}><Feather name="copy" size={22} color="#000" /></TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 20 }}><MaterialIcons name="share" size={22} color="#000" /></TouchableOpacity>
            <TouchableOpacity
              style={{ marginLeft: 20 }}
              onPress={() => {
                // Find the existing item based on input and translation
                const existingItem = history.find(
                  (item) =>
                    item.inputText === inputText &&
                    item.translatedText === translatedText &&
                    item.from === (languageNames[inputLanguage] || inputLanguage) &&
                    item.to === (languageNames[outputLanguage] || outputLanguage)
                );

                if (existingItem) {
                  // If the item exists, toggle the 'isFavorite' status
                  const updatedHistory = history.map((item) =>
                    item.id === existingItem.id
                      ? { ...item, isFavorite: !item.isFavorite }
                      : item
                  );
                  setHistory(updatedHistory);
                  toggleFavorite(existingItem); // Make sure to toggle favorite
                } else {
                  // If the item does not exist, create a new history item with 'isFavorite' set to true
                  const newItem: HistoryItem = {
                    id: Date.now().toString(),
                    from: languageNames[inputLanguage] || inputLanguage,
                    to: languageNames[outputLanguage] || outputLanguage,
                    inputText,
                    translatedText,
                    isFavorite: true, // Mark this item as a favorite
                  };
                  setHistory((prev) => [newItem, ...prev]);
                  toggleFavorite(newItem); // Add the new item to history
                }
              }}
            >
              {/* Get the existing item to determine if it's a favorite */}
              {(() => {
                const existingItem = history.find(
                  (item) =>
                    item.inputText === inputText &&
                    item.translatedText === translatedText &&
                    item.from === (languageNames[inputLanguage] || inputLanguage) &&
                    item.to === (languageNames[outputLanguage] || outputLanguage)
                );

                return (
                  <FontAwesome
                    name={existingItem?.isFavorite ? "star" : "star-o"} // Use filled star for favorites
                    size={22}
                    color={existingItem?.isFavorite ? "gold" : "#000"} // Conditional color for filled or outlined star
                  />
                );
              })()}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/History')}>
          <Ionicons name="time-outline" size={22} color="#000" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/Favorites')}>
          <Ionicons name="star-outline" size={22} color="#000" />
          <Text style={styles.navText}>Favorite</Text>
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
  pickerWrapper: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    color: '#000',
  },
  pickerText: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 10,
  },
  
});