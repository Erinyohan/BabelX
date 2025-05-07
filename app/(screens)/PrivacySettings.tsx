import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacySettings() {
  const router = useRouter();

  const [locationAccess, setLocationAccess] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/Settings')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Manage Privacy Options</Text>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Location Access</Text>
            <Switch
              value={locationAccess}
              onValueChange={setLocationAccess}
              thumbColor={locationAccess ? '#0a3d62' : '#ccc'}
              trackColor={{ false: '#ccc', true: '#aed6f1' }}
            />
          </View>
          <Text style={styles.description}>Allow app to use your location for personalized content.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Profile Visibility</Text>
            <Switch
              value={profileVisibility}
              onValueChange={setProfileVisibility}
              thumbColor={profileVisibility ? '#0a3d62' : '#ccc'}
              trackColor={{ false: '#ccc', true: '#aed6f1' }}
            />
          </View>
          <Text style={styles.description}>Control whether your profile is visible to others.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Activity Status</Text>
            <Switch
              value={activityStatus}
              onValueChange={setActivityStatus}
              thumbColor={activityStatus ? '#0a3d62' : '#ccc'}
              trackColor={{ false: '#ccc', true: '#aed6f1' }}
            />
          </View>
          <Text style={styles.description}>Show when you're active or last seen online.</Text>
        </View>
      </ScrollView>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  description: {
    marginTop: 8,
    fontSize: 13,
    color: '#666',
  },
});
