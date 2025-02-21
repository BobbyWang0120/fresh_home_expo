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
  FlatList,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { router, useNavigation } from 'expo-router';
import { SearchBar } from '@/components/home/SearchBar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

// Types
interface Category {
  id: string;
  name: string;
}

// Special category types
const ALL_CATEGORY = 'all';
const DISCOUNTED_CATEGORY = 'discounted';

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
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  // 首次加载数据
  useEffect(() => {
    loadInitialData();
    loadCartItemCount();
  }, []);

  // 监听分类变化加载商品
  useEffect(() => {
    if (!isInitialLoading) {
      loadProducts();
    }
  }, [selectedCategory]);

  // 添加页面焦点监听
  useFocusEffect(
    React.useCallback(() => {
      loadCartItemCount();
    }, [])
  );

  const loadInitialData = async () => {
    try {
      setIsInitialLoading(true);
      
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData);

      // 加载商品
      await loadProducts();
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setIsProductsLoading(true);
      
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

      if (selectedCategory && selectedCategory !== ALL_CATEGORY) {
        if (selectedCategory === DISCOUNTED_CATEGORY) {
          // No additional query filter needed, we'll filter discounted products after fetching
        } else {
          const category = categories.find(c => c.id === selectedCategory);
          if (category) {
            query = query.eq('category', category.name);
          }
        }
      }

      const { data: productsData, error: productsError } = await query;

      if (productsError) throw productsError;
      
      // Filter discounted products if needed
      let filteredProducts = productsData;
      if (selectedCategory === DISCOUNTED_CATEGORY) {
        filteredProducts = productsData.filter(
          product => product.discounted_price < product.price
        );
      }
      
      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsProductsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadProducts();
  };

  // 加载购物车数量
  const loadCartItemCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      if (error) throw error;
      setCartItemCount(count || 0);
    } catch (error) {
      console.error('Error loading cart count:', error);
    }
  };

  // 添加到购物车
  const addToCart = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('提示', '请先登录');
        return;
      }

      // 检查购物车是否已有该商品
      const { data: existingItem, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingItem) {
        // 更新数量
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        // 新增商品
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert([
            {
              user_id: user.id,
              product_id: productId,
              quantity: 1
            }
          ]);

        if (insertError) throw insertError;
      }

      // 刷新购物车数量
      await loadCartItemCount();
      Alert.alert('成功', '已添加到购物车');
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('错误', '添加到购物车失败');
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchContainer}>
        <SearchBar 
          onFocus={() => setSearchMode(true)}
          onBack={() => setSearchMode(false)}
          isSearchMode={searchMode}
        />
      </View>
      <TouchableOpacity 
        style={styles.cartButton} 
        onPress={() => router.push('/cart')}
      >
        <Ionicons name="cart-outline" size={24} color="#000000" />
        {cartItemCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>
              {cartItemCount > 99 ? '99+' : cartItemCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderCategoryItem = ({ item }: { item: Category | { id: string, name: string } }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemSelected
      ]}
      onPress={() => setSelectedCategory(selectedCategory === item.id ? ALL_CATEGORY : item.id)}
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
          <View style={styles.productHeader}>
            <View style={styles.productTitleContainer}>
              <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.productOrigin}>{item.origin}</Text>
            </View>
            <TouchableOpacity 
              style={styles.addToCartButton}
              onPress={(e) => {
                e.stopPropagation();
                addToCart(item.id);
              }}
            >
              <Ionicons name="add-circle" size={28} color="#000000" />
            </TouchableOpacity>
          </View>
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
      <StatusBar barStyle="dark-content" />
      {!searchMode && (
        <>
          {renderHeader()}
          {isInitialLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000000" />
            </View>
          ) : (
            <View style={styles.container}>
              <View style={styles.contentContainer}>
                {/* Categories Section - Left Side */}
                <View style={styles.categoriesContainer}>
                  <FlatList
                    data={[
                      { id: ALL_CATEGORY, name: 'All' },
                      { id: DISCOUNTED_CATEGORY, name: 'Discounted' },
                      ...categories
                    ]}
                    renderItem={renderCategoryItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                  />
                </View>

                {/* Products Grid - Right Side */}
                <View style={styles.productsContainer}>
                  <FlatList
                    data={products}
                    renderItem={renderProductItem}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.productsList}
                    refreshControl={
                      <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="#000000"
                      />
                    }
                    ListEmptyComponent={
                      <View style={styles.emptyContainer}>
                        {isProductsLoading ? (
                          <ActivityIndicator color="#000000" />
                        ) : (
                          <Text style={styles.emptyText}>
                            {selectedCategory === DISCOUNTED_CATEGORY 
                              ? '暂无打折商品'
                              : selectedCategory === ALL_CATEGORY 
                                ? '暂无商品'
                                : '该分类暂无商品'}
                          </Text>
                        )}
                      </View>
                    }
                  />
                </View>
              </View>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flex: 1,
    marginRight: 12,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    width: 100,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#F0F0F0',
  },
  categoriesList: {
    paddingVertical: 12,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  categoryItemSelected: {
    backgroundColor: '#F8F8F8',
    borderLeftWidth: 3,
    borderLeftColor: '#000000',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  categoryTextSelected: {
    color: '#000000',
    fontWeight: '600',
  },
  productsContainer: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  productsList: {
    padding: 12,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: '#F5F5F5',
  },
  productInfo: {
    padding: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
    lineHeight: 22,
  },
  productOrigin: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  unit: {
    fontSize: 14,
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
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    backgroundColor: '#000000',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  addToCartButton: {
    padding: 4,
  },
});
