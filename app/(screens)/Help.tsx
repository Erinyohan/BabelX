import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Help() {
  const router = useRouter();

  const helpTopics: { title: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
    { title: 'Getting Started', icon: 'book-outline' },
    { title: 'Report a Problem', icon: 'alert-circle-outline' },
    { title: 'Contact Support', icon: 'call-outline' },
    { title: 'Privacy Policy', icon: 'document-text-outline' },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/Settings')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Help Topics</Text>
        {helpTopics.map((topic, index) => (
          <TouchableOpacity key={index} style={styles.helpItem}>
            <View style={styles.helpLeft}>
              <Ionicons name={topic.icon} size={22} color="#0a3d62" />
              <Text style={styles.helpText}>{topic.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        ))}
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  helpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 1,
  },
  helpLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
});
