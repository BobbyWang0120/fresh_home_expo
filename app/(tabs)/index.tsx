import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, TextInput, Keyboard } from 'react-native';
import { CarouselBanner } from '@/components/home/CarouselBanner';
import { CategorySection } from '@/components/home/CategorySection';
import { PopularProducts } from '@/components/home/PopularProducts';
import { OnSaleProducts } from '@/components/home/OnSaleProducts';
import { HomeHeader } from '@/components/home/HomeHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';
import { SearchHistory } from '@/components/home/SearchHistory';
import { SearchBar } from '@/components/home/SearchBar';
import { RefreshableScrollView } from '@/components/common/RefreshableScrollView';

export default function HomeScreen() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  const handleRefresh = async () => {
    // 模拟刷新操作
    await new Promise(resolve => setTimeout(resolve, 1500));
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
          <RefreshableScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            onRefresh={handleRefresh}
          >
            <CarouselBanner />
            <CategorySection />
            <OnSaleProducts />
            <PopularProducts />
          </RefreshableScrollView>
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
