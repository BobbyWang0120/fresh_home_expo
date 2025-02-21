import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  SafeAreaView, 
  View, 
  Text, 
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  FlatList
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { SearchBar } from '@/components/home/SearchBar';

// Types
interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discounted_price: number;
  unit: string;
  origin: string;
  images: {
    storage_path: string;
    is_primary: boolean;
  }[];
}

export default function HomeScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData);

      // Fetch products with their primary images
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          discounted_price,
          unit,
          origin,
          images:product_images(storage_path, is_primary)
        `)
        .eq('is_active', true);

      if (selectedCategory) {
        const category = categories.find(c => c.id === selectedCategory);
        if (category) {
          query = query.eq('category', category.name);
        }
      }

      const { data: productsData, error: productsError } = await query;

      if (productsError) throw productsError;
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemSelected
      ]}
      onPress={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextSelected
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: Product }) => {
    const primaryImage = item.images?.find(img => img.is_primary);
    
    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <Image
          source={{ uri: primaryImage?.storage_path }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.productOrigin}>{item.origin}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>¥{item.discounted_price.toFixed(2)}</Text>
            <Text style={styles.unit}>/{item.unit}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <SearchBar 
        onFocus={() => setSearchMode(true)}
        onBack={() => setSearchMode(false)}
        isSearchMode={searchMode}
      />
      
      {!searchMode && (
        <>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000000" />
            </View>
          ) : (
            <View style={styles.container}>
              {/* Categories Section */}
              <View style={styles.categoriesContainer}>
                <FlatList
                  horizontal
                  data={categories}
                  renderItem={renderCategoryItem}
                  keyExtractor={item => item.id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesList}
                />
              </View>

              {/* Products Grid */}
              <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={item => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.productsGrid}
                columnWrapperStyle={styles.productRow}
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={handleRefresh}
                    tintColor="#000000"
                  />
                }
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {selectedCategory ? '该分类暂无商品' : '暂无商品'}
                    </Text>
                  </View>
                }
              />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryItem: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  categoryItemSelected: {
    backgroundColor: '#000000',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
  },
  productsGrid: {
    padding: 8,
  },
  productRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  productOrigin: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  unit: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 2,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
  },
});
