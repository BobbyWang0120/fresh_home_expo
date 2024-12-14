import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

const popularProducts = [
  {
    id: '1',
    name: 'Fresh Salmon',
    price: 25.99,
    unit: 'lb',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'King Crab',
    price: 45.99,
    unit: 'lb',
    image: 'https://images.unsplash.com/photo-1550747545-c896b5f89ff7?q=80&w=2067&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Fresh Shrimp',
    price: 18.99,
    unit: 'lb',
    image: 'https://images.unsplash.com/photo-1565680018434-b583b57b4f34?q=80&w=2070&auto=format&fit=crop',
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
              <Text style={styles.productPrice}>
                ${product.price}/{product.unit}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  scrollContent: {
    paddingRight: 15,
  },
  productCard: {
    width: 160,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});
