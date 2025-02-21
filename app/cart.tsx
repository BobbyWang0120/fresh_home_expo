import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

// Types for the database response
interface ProductImage {
  storage_path: string;
  is_primary: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  discounted_price: number;
  unit: string;
  product_images: ProductImage[];
}

interface CartItemResponse {
  id: string;
  quantity: number;
  products: Product;
}

// Types for the component state
interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    discounted_price: number;
    unit: string;
    images: ProductImage[];
  };
}

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('提示', '请先登录');
        router.back();
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          products!inner (
            id,
            name,
            price,
            discounted_price,
            unit,
            product_images (
              storage_path,
              is_primary
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Transform the data to match the CartItem interface
      const transformedData: CartItem[] = (data || []).map(item => {
        const rawItem = item as unknown as {
          id: string;
          quantity: number;
          products: {
            id: string;
            name: string;
            price: number;
            discounted_price: number;
            unit: string;
            product_images: ProductImage[];
          };
        };

        return {
          id: rawItem.id,
          quantity: rawItem.quantity,
          product: {
            id: rawItem.products.id,
            name: rawItem.products.name,
            price: rawItem.products.price,
            discounted_price: rawItem.products.discounted_price,
            unit: rawItem.products.unit,
            images: rawItem.products.product_images || []
          }
        };
      });

      setCartItems(transformedData);
      setSelectedItems(transformedData.map(item => item.id));
    } catch (error) {
      console.error('Error loading cart items:', error);
      Alert.alert('错误', '加载购物车失败');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, change: number) => {
    try {
      const item = cartItems.find(item => item.id === cartItemId);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + change);
      
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId);

      if (error) throw error;

      setCartItems(prev => prev.map(item => 
        item.id === cartItemId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('错误', '更新数量失败');
    }
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedItems(prev => 
      prev.length === cartItems.length 
        ? [] 
        : cartItems.map(item => item.id)
    );
  };

  const getTotalPrice = () => {
    return selectedItems.reduce((total, id) => {
      const item = cartItems.find(item => item.id === id);
      return total + (item ? item.product.discounted_price * item.quantity : 0);
    }, 0);
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    Alert.alert('提示', '结算功能开发中');
  };

  const deleteCartItem = async (cartItemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      // 更新本地状态
      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      setSelectedItems(prev => prev.filter(id => id !== cartItemId));

      // 通知用户
      Alert.alert('成功', '商品已从购物车中移除');
    } catch (error) {
      console.error('Error deleting cart item:', error);
      Alert.alert('错误', '删除商品失败');
    }
  };

  const handleDelete = (cartItemId: string) => {
    Alert.alert(
      '确认删除',
      '确定要将此商品从购物车中删除吗？',
      [
        {
          text: '取消',
          style: 'cancel'
        },
        {
          text: '确定',
          style: 'destructive',
          onPress: () => deleteCartItem(cartItemId)
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>购物车</Text>
        </View>

        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>购物车是空的</Text>
          </View>
        ) : (
          <ScrollView style={styles.cartContent}>
            {cartItems.map(item => {
              const primaryImage = item.product.images?.find(img => img.is_primary);
              
              return (
                <View key={item.id} style={styles.cartItem}>
                  <TouchableOpacity
                    onPress={() => toggleSelectItem(item.id)}
                    style={styles.checkbox}
                  >
                    <Ionicons
                      name={selectedItems.includes(item.id) ? "checkbox" : "square-outline"}
                      size={24}
                      color="#000"
                    />
                  </TouchableOpacity>
                  
                  <Image
                    source={{ uri: primaryImage?.storage_path }}
                    style={styles.productImage}
                  />
                  
                  <View style={styles.productInfo}>
                    <View style={styles.productHeader}>
                      <Text style={styles.productName}>{item.product.name}</Text>
                      <TouchableOpacity
                        onPress={() => handleDelete(item.id)}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash-outline" size={20} color="#666" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.productPrice}>
                      ¥{item.product.discounted_price}/{item.product.unit}
                    </Text>
                    
                    <View style={styles.quantityControl}>
                      <TouchableOpacity 
                        onPress={() => updateQuantity(item.id, -1)}
                        style={styles.quantityButton}
                      >
                        <Ionicons name="remove" size={20} color="#000" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity 
                        onPress={() => updateQuantity(item.id, 1)}
                        style={styles.quantityButton}
                      >
                        <Ionicons name="add" size={20} color="#000" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Bottom Total Bar */}
        {cartItems.length > 0 && (
          <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <TouchableOpacity 
              style={styles.selectAllButton}
              onPress={toggleSelectAll}
            >
              <Ionicons
                name={selectedItems.length === cartItems.length ? "checkbox" : "square-outline"}
                size={24}
                color="#000"
              />
              <Text style={styles.selectAllText}>全选</Text>
            </TouchableOpacity>

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>总计: </Text>
              <Text style={styles.totalPrice}>¥{getTotalPrice().toFixed(2)}</Text>
            </View>

            <TouchableOpacity 
              style={[
                styles.checkoutButton,
                selectedItems.length === 0 && styles.checkoutButtonDisabled
              ]}
              disabled={selectedItems.length === 0}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>
                结算 ({selectedItems.length})
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  cartContent: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#f5f5f5',
  },
  productInfo: {
    flex: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  deleteButton: {
    padding: 4,
    marginRight: -4,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginRight: 8,
  },
  productPrice: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#000',
  },
  totalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 15,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  checkoutButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#ccc',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
