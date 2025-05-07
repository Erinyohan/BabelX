import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ThemeSettings() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [systemTheme, setSystemTheme] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/Settings')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theme Settings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.optionRow}>
          <View>
            <Text style={styles.optionTitle}>Use System Theme</Text>
            <Text style={styles.optionDesc}>Automatically switch based on device settings</Text>
          </View>
          <Switch
            value={systemTheme}
            onValueChange={setSystemTheme}
            thumbColor={systemTheme ? '#0a3d62' : '#ccc'}
            trackColor={{ false: '#ccc', true: '#aed6f1' }}
          />
        </View>

        <View style={styles.optionRow}>
          <View>
            <Text style={styles.optionTitle}>Dark Mode</Text>
            <Text style={styles.optionDesc}>Enable dark appearance</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            disabled={systemTheme}
            thumbColor={darkMode ? '#0a3d62' : '#ccc'}
            trackColor={{ false: '#ccc', true: '#aed6f1' }}
          />
        </View>
      </View>
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
  content: {
    padding: 20,
  },
  optionRow: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionDesc: {
    fontSize: 13,
    color: '#666',
  },
});
