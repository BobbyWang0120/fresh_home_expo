import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { Colors } from '../../constants/Colors';
import { router } from 'expo-router';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
  unit: string;
  stock: number;
}

export default function CategoriesScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      // 获取所有商品
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (productsError) throw productsError;

      setProducts(productsData);

      // 获取所有唯一的分类
      const uniqueCategories = Array.from(
        new Set(productsData.map(product => product.category))
      ).filter(Boolean);

      setCategories(['All', ...uniqueCategories]);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchProducts();
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const renderProduct = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          style={styles.productImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>暂无图片</Text>
        </View>
      )}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.productPrice}>¥{product.price}/{product.unit}</Text>
        <Text style={styles.productStock}>库存: {product.stock}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>分类</Text>
      </View>
      
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          style={styles.categoriesContainer}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextSelected
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.productsContainer}
        contentContainerStyle={styles.productsContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>该分类下暂无商品</Text>
          </View>
        ) : (
          <View style={styles.productsGrid}>
            {filteredProducts.map(renderProduct)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: Colors.light.background,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.light.text,
  },
  categoriesWrapper: {
    backgroundColor: Colors.light.background,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoriesContainer: {
    height: 44,
  },
  categoriesContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
  },
  categoryButtonSelected: {
    backgroundColor: Colors.light.tint,
  },
  categoryButtonText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  productsContainer: {
    flex: 1,
  },
  productsContent: {
    padding: 12,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F3F4F6',
  },
  noImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: Colors.light.icon,
    fontSize: 14,
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: Colors.light.tint,
    fontWeight: '600',
    marginBottom: 2,
  },
  productStock: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.icon,
  },
});
