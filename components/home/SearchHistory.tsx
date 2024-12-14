import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const searchHistory = [
  'Fresh Salmon',
  'King Crab',
  'Live Lobster',
  'Organic Vegetables',
  'Fresh Fruits',
  'Premium Seafood',
  'Today\'s Special',
  'Local Fish',
];

export function SearchHistory() {
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.historyItem}>
      <View style={styles.historyItemContent}>
        <Ionicons name="time-outline" size={20} color="#666" />
        <Text style={styles.historyText}>{item}</Text>
      </View>
      <Ionicons name="arrow-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Searches</Text>
        <TouchableOpacity>
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={searchHistory}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  clearButton: {
    fontSize: 14,
    color: '#666',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
  },
});
