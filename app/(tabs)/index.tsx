import React from 'react';
import { StyleSheet, View, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CarouselBanner } from '@/components/home/CarouselBanner';
import { CategorySection } from '@/components/home/CategorySection';
import { PopularProducts } from '@/components/home/PopularProducts';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search fresh products..."
            placeholderTextColor="#999"
          />
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <CarouselBanner />
        <CategorySection />
        <PopularProducts />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
