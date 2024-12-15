import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

const popularProducts = [
  {
    id: '1',
    name: 'Fresh Salmon',
    price: 25.99,
    unit: 'lb',
    image: 'https://plus.unsplash.com/premium_photo-1723478431094-4854c4555fc2?q=80&w=3227&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'King Crab',
    price: 45.99,
    unit: 'lb',
    image: 'https://plus.unsplash.com/premium_photo-1722775045882-98916a9cfb0b?q=80&w=3270&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Fresh Shrimp',
    price: 18.99,
    unit: 'lb',
    image: 'https://plus.unsplash.com/premium_photo-1709146097755-f5f9ba107de8?q=80&w=3269&auto=format&fit=crop',
  },
];

export function PopularProducts() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Popular Products</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {popularProducts.map((product) => (
          <TouchableOpacity key={product.id} style={styles.productCard}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <Text style={styles.productPrice}>{product.price}</Text>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
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
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currencySymbol: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginRight: 1,
  },
  productPrice: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  unitText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 1,
  },
});
