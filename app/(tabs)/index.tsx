import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CarouselBanner } from '@/components/home/CarouselBanner';
import { CategorySection } from '@/components/home/CategorySection';
import { PopularProducts } from '@/components/home/PopularProducts';
import { HomeHeader } from '@/components/home/HomeHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';
import { SearchHistory } from '@/components/home/SearchHistory';
import { SearchBar } from '@/components/home/SearchBar';

export default function HomeScreen() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ThemedView style={styles.container}>
        <HomeHeader />
        <SearchBar 
          onFocus={handleSearchFocus}
          onBack={handleSearchBlur}
          isSearchMode={isSearchFocused}
        />
        {isSearchFocused ? (
          <SearchHistory />
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <CarouselBanner />
            <CategorySection />
            <PopularProducts />
          </ScrollView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
