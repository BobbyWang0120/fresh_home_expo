import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// 模拟的商品描述数据
const productDescription = {
  description: "Sourced from the finest suppliers, this premium seafood product represents the perfect balance of quality and taste. Each piece is carefully selected to ensure the highest standards of freshness and flavor.",
  specifications: [
    { label: "Origin", value: "Pacific Ocean" },
    { label: "Storage", value: "Keep refrigerated (0-4°C)" },
    { label: "Shelf Life", value: "3-5 days from delivery" },
    { label: "Packaging", value: "Vacuum sealed" }
  ],
  nutritionFacts: {
    servingSize: "100g",
    calories: "120",
    protein: "24g",
    fat: "2g",
    omega3: "1.5g"
  }
};

export default function ProductDetail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { 
    id, 
    name, 
    image, 
    originalPrice, 
    salePrice, 
    unit, 
    discount 
  } = params;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.container}>
        <StatusBar style="dark" />
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: image as string }}
              style={styles.productImage}
              resizeMode="cover"
            />
            {/* Header Buttons */}
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={() => router.back()}
              >
                <Ionicons name="chevron-back" size={24} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="share-outline" size={22} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{name}</Text>
            
            <View style={styles.priceContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.salePrice}>${Number(salePrice).toFixed(2)}</Text>
                <Text style={styles.originalPrice}>${Number(originalPrice).toFixed(2)}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{discount}%</Text>
                </View>
              </View>
              <Text style={styles.unitText}>/{unit}</Text>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{productDescription.description}</Text>
            </View>

            {/* Specifications */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Specifications</Text>
              {productDescription.specifications.map((spec, index) => (
                <View key={index} style={styles.specificationRow}>
                  <Text style={styles.specLabel}>{spec.label}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>

            {/* Nutrition Facts */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nutrition Facts</Text>
              <View style={styles.nutritionContainer}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{productDescription.nutritionFacts.calories}</Text>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{productDescription.nutritionFacts.protein}</Text>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{productDescription.nutritionFacts.fat}</Text>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{productDescription.nutritionFacts.omega3}</Text>
                  <Text style={styles.nutritionLabel}>Omega-3</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Add to Cart Button */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.addToCartButton}>
            <Ionicons name="cart-outline" size={24} color="#fff" style={styles.cartIcon} />
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#000',
  },
  productImage: {
    width: '100%',
    height: Platform.OS === 'ios' ? 450 : 420,
    opacity: 0.97,
  },
  headerButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 45,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flex: 1,
  },
  productInfo: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salePrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4CAF50',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 20,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  unitText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  discountBadge: {
    backgroundColor: '#FFE8E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#FF4D4F',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  specLabel: {
    fontSize: 15,
    color: '#666',
  },
  specValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  nutritionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 13,
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5E5',
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartIcon: {
    marginRight: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
