import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const onSaleProducts = [
  {
    id: '1',
    name: 'Premium Tuna Sashimi',
    originalPrice: 39.99,
    salePrice: 29.99,
    unit: 'lb',
    discount: 25,
    image: 'https://images.unsplash.com/photo-1648431529663-8ae9606630c0?q=80&w=3072&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Wild Caught Lobster',
    originalPrice: 55.99,
    salePrice: 39.99,
    unit: 'lb',
    discount: 30,
    image: 'https://plus.unsplash.com/premium_photo-1719611418025-07c08bf00a49?q=80&w=3087&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Fresh Oysters',
    originalPrice: 24.99,
    salePrice: 18.99,
    unit: 'dozen',
    discount: 20,
    image: 'https://plus.unsplash.com/premium_photo-1670742337957-fcd72066e4de?q=80&w=3087&auto=format&fit=crop',
  },
];

export function OnSaleProducts() {
  const router = useRouter();

  const handleViewAll = () => {
    router.push('/(tabs)/categories');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Special Offers</Text>
        <TouchableOpacity onPress={handleViewAll} style={styles.viewAllButton}>
          <Ionicons name="arrow-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {onSaleProducts.map((product) => (
          <TouchableOpacity 
            key={product.id} 
            style={styles.productCard}
            onPress={() => router.push({
              pathname: `/product/${product.id}`,
              params: {
                ...product,
                originalPrice: product.originalPrice.toString(),
                salePrice: product.salePrice.toString(),
              }
            })}
          >
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{product.discount}%</Text>
            </View>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
              <View style={styles.priceContainer}>
                <View style={styles.priceRow}>
                  <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
                  <Text style={styles.salePrice}>${product.salePrice.toFixed(2)}</Text>
                </View>
                <Text style={styles.unitText}>/{product.unit}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  viewAllButton: {
    padding: 8,
  },
  scrollContent: {
    paddingRight: 15,
    paddingBottom: 5,
  },
  productCard: {
    width: 160,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    height: 40,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  salePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  unitText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});
