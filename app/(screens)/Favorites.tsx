import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the type for each favorite item
type TranslationItem = {
  id: string;
  from: string;
  to: string;
  inputText: string;
  translatedText: string;
  isFavorite: boolean;
};

// Load data from AsyncStorage
const loadFavorites = async (username: string) => {
  try {
    const favoritesData = await AsyncStorage.getItem(`${username}_favorites`);
    return favoritesData ? JSON.parse(favoritesData) : [];
  } catch (error) {
    console.error('Error loading favorites from AsyncStorage:', error);
    return [];
  }
};

// Save data to AsyncStorage
const saveFavorites = async (username: string, favorites: TranslationItem[]) => {
  try {
    await AsyncStorage.setItem(`${username}_favorites`, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to AsyncStorage:', error);
  }
};

export default function Favorites() {
  const [favorites, setFavorites] = useState<TranslationItem[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  // Load user and favorites when the component mounts
  const loadUserAndFavorites = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem('username');
      if (!storedUsername) {
        console.log('No username found in AsyncStorage');
        return;
      }
      setUsername(storedUsername);

      // Load favorites from AsyncStorage (without filtering)
      const savedFavorites = await loadFavorites(storedUsername);
      console.log('Loaded favorites from AsyncStorage:', savedFavorites);

      setFavorites(savedFavorites); // Store all favorites, not just filtered ones
    } catch (error) {
      console.error('Error loading user and favorites:', error);
    }
  };

  useEffect(() => {
    loadUserAndFavorites();
  }, []);

  // Show confirmation dialog and remove the item from favorites
  const removeFromFavorites = async (id: string) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this item from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            if (!username) return;
  
            // Remove from favorites
            const updatedFavorites = favorites.filter((item) => item.id !== id);
            await saveFavorites(username, updatedFavorites);
            setFavorites(updatedFavorites);
  
            // Also update isFavorite in the history
            const fullHistory = await AsyncStorage.getItem(`${username}_history`);
            if (fullHistory) {
              const parsedHistory = JSON.parse(fullHistory).map((item: TranslationItem) =>
                item.id === id ? { ...item, isFavorite: false } : item
              );
              await AsyncStorage.setItem(`${username}_history`, JSON.stringify(parsedHistory));
            }
  
            console.log(`Removed item ${id} from favorites and updated history`);
          },
        },
      ]
    );
  };
  

  const renderItem = ({ item }: { item: TranslationItem }) => {
    return (
      <View style={styles.historyItem}>
        <View style={styles.historyTextBlock}>
          <Text style={styles.languageLabel}>{item.from} → {item.to}</Text>
          <Text style={styles.inputText}>“{item.inputText}”</Text>
          <Text style={styles.translatedText}>→ “{item.translatedText}”</Text>
        </View>
        <View style={styles.iconGroup}>
          {/* Always show the gold filled star */}
          <TouchableOpacity onPress={() => removeFromFavorites(item.id)}>
            <FontAwesome
              name="star"
              size={22}
              color="gold" // Always filled with gold
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>
      {favorites.length === 0 ? (
        <Text style={styles.noDataText}>No favorites found.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
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
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyTextBlock: { flex: 1, paddingRight: 10 },
  languageLabel: { fontWeight: 'bold', fontSize: 14, marginBottom: 5 },
  inputText: { fontSize: 14, color: '#333' },
  translatedText: { fontSize: 14, color: '#555', marginTop: 5 },
  iconGroup: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#999',
    marginTop: 30,
  },
});
