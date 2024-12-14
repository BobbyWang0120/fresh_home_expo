import React from 'react';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const bannerData = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=2074&auto=format&fit=crop',
  },
];

export function CarouselBanner() {
  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={width}
        height={width / 2}
        autoPlay={true}
        data={bannerData}
        scrollAnimationDuration={1000}
        renderItem={({ item }) => (
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: item.image }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  bannerContainer: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 10,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
});
