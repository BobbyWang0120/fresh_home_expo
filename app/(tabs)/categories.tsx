import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, Image, Dimensions, RefreshControl } from 'react-native';
import { categories, products, Category, Product } from '../../data/categories';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

const { width } = Dimensions.get('window');
const CONTAINER_PADDING = 16;
const CARD_GAP = 12;
const PRODUCT_WIDTH = (width - (CONTAINER_PADDING * 2) - CARD_GAP) / 2;

export default function CategoriesScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filteredProducts = useCallback(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    return products.filter(product => product.category === selectedCategory);
  }, [selectedCategory]);

  const handleCategoryPress = (category: Category | null) => {
    if (category) {
      setSelectedCategory(category.id);
    } else {
      setSelectedCategory('all');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // 模拟刷新操作
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity style={styles.categoryItem} onPress={() => handleCategoryPress(item)}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <View style={styles.categoryTextContainer}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryNameEn}>{item.nameEn}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: typeof products[0] }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productNameEn} numberOfLines={1}>{item.nameEn}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}/{item.unit}</Text>
        {item.originalPrice > item.price && (
          <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}/{item.unit}</Text>
        )}
        <Text style={styles.origin}>{item.origin}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>分类</Text>
        </View>

        {/* Categories List */}
        <View style={styles.categoriesWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === 'all' && styles.categoryButtonActive
              ]}
              onPress={() => handleCategoryPress(null)}
            >
              <Text style={[
                styles.categoryName,
                selectedCategory === 'all' && styles.categoryNameActive
              ]}>全部</Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && styles.categoryButtonActive
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.categoryNameActive
                ]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products Grid */}
        <FlatList
          data={filteredProducts()}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
          columnWrapperStyle={styles.productRow}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#666"
              colors={['#666']}
            />
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  categoriesWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    overflow: 'hidden',
  },
  categoriesContainer: {
    height: 50,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    height: '100%',
  },
  categoryButton: {
    height: '100%',
    paddingHorizontal: 16,
    marginRight: 15,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  categoryButtonActive: {
    borderBottomColor: '#4CAF50',
  },
  categoryName: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  categoryNameActive: {
    color: '#4CAF50',
  },
  productsContainer: {
    paddingHorizontal: CONTAINER_PADDING,
    paddingVertical: CONTAINER_PADDING,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  productCard: {
    width: PRODUCT_WIDTH,
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
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  productImage: {
    width: '100%',
    height: PRODUCT_WIDTH,
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
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  origin: {
    fontSize: 12,
    color: '#666',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  categoryTextContainer: {
    flexDirection: 'column',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryNameEn: {
    fontSize: 12,
    color: '#666',
  },
});
