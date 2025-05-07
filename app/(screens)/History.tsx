import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HistoryItem = {
  id: string;
  from: string;
  to: string;
  inputText: string;
  translatedText: string;
  isFavorite: boolean; // Track favorite status
};

// Load history from AsyncStorage
const loadHistory = async (username: string) => {
  try {
    const historyData = await AsyncStorage.getItem(`${username}_history`);
    return historyData ? JSON.parse(historyData) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

// Save updated history to AsyncStorage
const saveHistory = async (username: string, history: HistoryItem[]) => {
  try {
    await AsyncStorage.setItem(`${username}_history`, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save history:', error);
  }
};

// Load favorites from AsyncStorage
const loadFavorites = async (username: string) => {
  try {
    const favoritesData = await AsyncStorage.getItem(`${username}_favorites`);
    return favoritesData ? JSON.parse(favoritesData) : [];
  } catch (error) {
    console.error('Failed to load favorites:', error);
    return [];
  }
};

// Save favorites to AsyncStorage
const saveFavorites = async (username: string, favorites: HistoryItem[]) => {
  try {
    await AsyncStorage.setItem(`${username}_favorites`, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};

const languageMap: { [key: string]: string } = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  zh: 'Chinese',
  ja: 'Japanese',
  hi: 'Hindi',
  ar: 'Arabic',
};

export default function History() {
  const [username, setUsername] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [deletedHistory, setDeletedHistory] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchHistoryForUser = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);

          const savedHistory = await loadHistory(storedUsername);
          const deletedHistoryData = await AsyncStorage.getItem(`${storedUsername}_deletedHistory`);
          const deletedHistoryArray = deletedHistoryData ? JSON.parse(deletedHistoryData) : [];
          setDeletedHistory(deletedHistoryArray);

          const filteredHistory = savedHistory.filter((item: HistoryItem) => !deletedHistoryArray.includes(item.id));
          setHistory(filteredHistory);
        } else {
          console.warn('No active user session');
          router.push('/');
        }
      } catch (error) {
        console.error('Error loading user or history:', error);
      }
    };

    fetchHistoryForUser();
  }, [router]);

  // Toggle favorite status
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

  // Delete an item from history and move it to deleted history
  const deleteItem = async (id: string) => {
    if (!username) return;

    Alert.alert('Delete Entry', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedHistory = history.filter((item) => item.id !== id);
          setHistory(updatedHistory);
          await saveHistory(username, updatedHistory);

          const deletedHistory = await AsyncStorage.getItem(`${username}_deletedHistory`);
          const deletedHistoryArray = deletedHistory ? JSON.parse(deletedHistory) : [];
          deletedHistoryArray.push(id);
          await AsyncStorage.setItem(`${username}_deletedHistory`, JSON.stringify(deletedHistoryArray));
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyTextBlock}>
        <Text style={styles.languageLabel}>
          {languageMap[item.from] || item.from} → {languageMap[item.to] || item.to}
        </Text>
        <Text style={styles.inputText}>“{item.inputText}”</Text>
        <Text style={styles.translatedText}>→ “{item.translatedText}”</Text>
      </View>
      <View style={styles.iconGroup}>
        <TouchableOpacity onPress={() => deleteItem(item.id)}>
          <MaterialIcons name="delete-outline" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => toggleFavorite(item)}>
          {/* Change to filled star if isFavorite is true */}
          <FontAwesome name={item.isFavorite ? 'star' : 'star-o'} size={22} color={item.isFavorite ? 'gold' : '#000'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Translation History</Text>
      </View>
      {history.length === 0 ? (
        <Text style={styles.noDataText}>No history found.</Text>
      ) : (
        <FlatList
          data={history}
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
  headerTitle: { color: '#fff', fontSize: 18, marginLeft: 10, fontWeight: 'bold' },
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
