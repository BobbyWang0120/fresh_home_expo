import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, SafeAreaView, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, usePathname } from 'expo-router';
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
  const scrollViewRef = useRef<RefreshableScrollView>(null);
  const lastTabPressTime = useRef<number>(0);
  const pathname = usePathname();
  const navigation = useNavigation();

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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      if (pathname === '/(tabs)/') {
        e.preventDefault();
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTabPressTime.current;
        
        if (timeDiff < 300) {
          // Double tap detected
          handleRefresh();
        } else {
          // Single tap - scroll to top
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }
        lastTabPressTime.current = currentTime;
      }
    });

    return unsubscribe;
  }, [pathname, navigation]);

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
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            onRefresh={handleRefresh}
          >
            <CarouselBanner />
            <CategorySection />
            <PopularProducts />
            <OnSaleProducts />
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
