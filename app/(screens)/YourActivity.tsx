import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart, LineChart, PieChart, ProgressChart } from 'react-native-chart-kit';

export default function YourActivity() {
  const router = useRouter();

  const screenWidth = Dimensions.get('window').width;

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{ data: [30, 45, 35, 80, 99, 43, 50] }],
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/Settings')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Activity</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
            <View style={styles.card}>
                <Ionicons name="time-outline" size={28} color="#0a3d62" />
                <Text style={styles.cardLabel}>Total Learning Time</Text>
                <Text style={styles.cardValue}>5h 23m</Text>
            </View>
            <View style={styles.card}>
                <Ionicons name="language-outline" size={28} color="#0a3d62" />
                <Text style={styles.cardLabel}>Top Language</Text>
                <Text style={styles.cardValue}>Spanish</Text>
            </View>
            <View style={styles.card}>
                <Ionicons name="sync-outline" size={28} color="#0a3d62" />
                <Text style={styles.cardLabel}>Translations Made</Text>
                <Text style={styles.cardValue}>14</Text>
            </View>
        </View>


        {/* Weekly Activity Chart */}
        <Text style={styles.sectionTitle}>Weekly Activity</Text>
        <BarChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
                backgroundColor: '#f6f6f6',
                backgroundGradientFrom: '#f6f6f6',
                backgroundGradientTo: '#f6f6f6',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(10, 61, 98, ${opacity})`,
                labelColor: () => '#333',
                barPercentage: 0.6,
            }}
            style={styles.chart}
            />


        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
        <Ionicons name="language-outline" size={20} color="#0a3d62" />
        <Text style={styles.activityText}>You translated 3 phrases to Spanish</Text>
        </View>
        <View style={styles.activityItem}>
        <Ionicons name="book-outline" size={20} color="#0a3d62" />
        <Text style={styles.activityText}>Completed daily vocabulary challenge</Text>
        </View>
        <View style={styles.activityItem}>
        <Ionicons name="trophy-outline" size={20} color="#0a3d62" />
        <Text style={styles.activityText}>New streak: 7 days learning Spanish!</Text>
        </View>
        <View style={styles.activityItem}>
        <Ionicons name="mic-outline" size={20} color="#0a3d62" />
        <Text style={styles.activityText}>Practiced pronunciation for 5 minutes</Text>
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
  headerTitle: { color: '#fff', fontSize: 18, marginLeft: 10, fontWeight: 'bold' },
  content: {
    padding: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '30%',
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0a3d62',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
  },
  chart: {
    borderRadius: 10,
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 1,
  },
  activityText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 14,
  },
});
