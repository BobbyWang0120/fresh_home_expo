import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 模拟购物车数据
const cartItems = [
  {
    id: '1',
    name: 'Fresh Salmon',
    price: 25.99,
    quantity: 2,
    unit: 'lb',
  },
  {
    id: '2',
    name: 'King Crab',
    price: 45.99,
    quantity: 1,
    unit: 'lb',
  },
  {
    id: '3',
    name: 'Fresh Shrimp',
    price: 18.99,
    quantity: 3,
    unit: 'lb',
  },
];

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedItems, setSelectedItems] = useState<string[]>(cartItems.map(item => item.id));
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(cartItems.map(item => [item.id, item.quantity]))
  );

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

  const updateQuantity = (id: string, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + change),
    }));
  };

  const getTotalPrice = () => {
    return selectedItems.reduce((total, id) => {
      const item = cartItems.find(item => item.id === id);
      return total + (item ? item.price * quantities[id] : 0);
    }, 0);
  };

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
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
        </View>

        {/* Cart Items */}
        <ScrollView style={styles.cartContent}>
          {cartItems.map(item => (
            <View key={item.id} style={styles.cartItem}>
              <TouchableOpacity
                onPress={() => toggleSelectItem(item.id)}
                style={styles.checkbox}
              >
                <Ionicons
                  name={selectedItems.includes(item.id) ? "checkbox" : "square-outline"}
                  size={24}
                  color="#4CAF50"
                />
              </TouchableOpacity>
              
              <Image
                source={{ uri: 'https://via.placeholder.com/100' }}
                style={styles.productImage}
              />
              
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}/{item.unit}</Text>
                
                <View style={styles.quantityControl}>
                  <TouchableOpacity 
                    onPress={() => updateQuantity(item.id, -1)}
                    style={styles.quantityButton}
                  >
                    <Ionicons name="remove" size={20} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantities[item.id]}</Text>
                  <TouchableOpacity 
                    onPress={() => updateQuantity(item.id, 1)}
                    style={styles.quantityButton}
                  >
                    <Ionicons name="add" size={20} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Total Bar */}
        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom + 10, 20) }]}>
          <TouchableOpacity 
            style={styles.selectAllButton}
            onPress={toggleSelectAll}
          >
            <Ionicons
              name={selectedItems.length === cartItems.length ? "checkbox" : "square-outline"}
              size={24}
              color="#4CAF50"
            />
            <Text style={styles.selectAllText}>Select All</Text>
          </TouchableOpacity>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total: </Text>
            <Text style={styles.totalPrice}>${getTotalPrice().toFixed(2)}</Text>
          </View>

          <TouchableOpacity 
            style={[
              styles.checkoutButton,
              selectedItems.length === 0 && styles.checkoutButtonDisabled
            ]}
            disabled={selectedItems.length === 0}
          >
            <Text style={styles.checkoutButtonText}>
              Checkout ({selectedItems.length})
            </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
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
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#4CAF50',
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
    color: '#333',
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
    color: '#333',
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
    color: '#4CAF50',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
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
