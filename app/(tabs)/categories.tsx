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
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredProducts = useCallback(() => {
    if (selectedCategory === 'all') {
      return products;
    }
    if (selectedSubcategory === 'all') {
      return products.filter(product => product.category === selectedCategory);
    }
    return products.filter(
      product => 
        product.category === selectedCategory && 
        product.subcategory === selectedSubcategory
    );
  }, [selectedCategory, selectedSubcategory]);

  const handleCategoryPress = (category: Category | null) => {
    if (category) {
      setSelectedCategory(category.id);
      setSelectedSubcategory('all');
      setCurrentCategory(category);
    } else {
      setSelectedCategory('all');
      setSelectedSubcategory('all');
      setCurrentCategory(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // 模拟刷新操作
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}/{item.unit}</Text>
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
        <View style={[
          styles.categoriesWrapper,
          { height: currentCategory ? 100 : 50 }
        ]}>
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

          {/* Subcategories */}
          {currentCategory && (
            <View style={styles.subcategoriesWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.subcategoriesContainer}
                contentContainerStyle={styles.subcategoriesContent}
              >
                <TouchableOpacity
                  style={[
                    styles.subcategoryButton,
                    selectedSubcategory === 'all' && styles.subcategoryButtonActive
                  ]}
                  onPress={() => setSelectedSubcategory('all')}
                >
                  <Text style={[
                    styles.subcategoryName,
                    selectedSubcategory === 'all' && styles.subcategoryNameActive
                  ]}>全部{currentCategory.name}</Text>
                </TouchableOpacity>
                {currentCategory.subcategories.map((subcategory) => (
                  <TouchableOpacity
                    key={subcategory.id}
                    style={[
                      styles.subcategoryButton,
                      selectedSubcategory === subcategory.id && styles.subcategoryButtonActive
                    ]}
                    onPress={() => setSelectedSubcategory(subcategory.id)}
                  >
                    <Text style={[
                      styles.subcategoryName,
                      selectedSubcategory === subcategory.id && styles.subcategoryNameActive
                    ]}>{subcategory.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
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
  subcategoriesWrapper: {
    height: 50,
  },
  subcategoriesContainer: {
    height: '100%',
  },
  subcategoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  subcategoryButton: {
    height: 34,
    paddingHorizontal: 16,
    marginRight: 10,
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 17,
  },
  subcategoryButtonActive: {
    backgroundColor: '#4CAF50',
  },
  subcategoryName: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  subcategoryNameActive: {
    color: '#fff',
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
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});
