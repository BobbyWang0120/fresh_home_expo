import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, Image, Dimensions } from 'react-native';
import { categories, products, Category, Product } from '../../data/categories';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';

const { width } = Dimensions.get('window');
const PRODUCT_WIDTH = (width - 40) / 2;

export default function CategoriesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

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
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          title: "Categories",
          headerShadowVisible: true,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: '#333',
          },
        }}
      />
      <View style={styles.container}>
        {/* Categories List */}
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
            <Text style={styles.categoryIcon}>🌊</Text>
            <Text style={[
              styles.categoryName,
              selectedCategory === 'all' && styles.categoryNameActive
            ]}>All</Text>
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
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryName,
                selectedCategory === category.id && styles.categoryNameActive
              ]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Subcategories */}
        {currentCategory && (
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
              ]}>All {currentCategory.name}</Text>
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
        )}

        {/* Products Grid */}
        <FlatList
          data={filteredProducts()}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
          columnWrapperStyle={styles.productRow}
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
  categoriesContainer: {
    maxHeight: 90,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoriesContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
  },
  categoryButtonActive: {
    backgroundColor: '#4CAF50',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  categoryNameActive: {
    color: '#fff',
  },
  subcategoriesContainer: {
    maxHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subcategoriesContent: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  subcategoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f8f8f8',
    marginRight: 10,
  },
  subcategoryButtonActive: {
    backgroundColor: '#4CAF50',
  },
  subcategoryName: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  subcategoryNameActive: {
    color: '#fff',
  },
  productsContainer: {
    padding: 10,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productCard: {
    width: PRODUCT_WIDTH,
    marginBottom: 20,
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
    height: PRODUCT_WIDTH,
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
