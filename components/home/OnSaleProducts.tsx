import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { products } from '../../data/categories';

export function OnSaleProducts() {
  const router = useRouter();

  // 获取前三个商品作为特价商品
  const onSaleProducts = products.slice(0, 3);

  const handleViewAll = () => {
    router.push('/(tabs)/categories');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>特价商品</Text>
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
                price: product.price.toString(),
              }
            })}
          >
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
              <Text style={styles.productNameEn} numberOfLines={1}>{product.nameEn}</Text>
              <View style={styles.priceContainer}>
                <View style={styles.priceRow}>
                  <Text style={styles.originalPrice}>${product.price.toFixed(2)}/{product.unit}</Text>
                  <Text style={styles.salePrice}>${product.originalPrice.toFixed(2)}/{product.unit}</Text>
                </View>
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
    marginBottom: 4,
  },
  productNameEn: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
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
});
