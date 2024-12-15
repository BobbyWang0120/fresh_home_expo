import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { orders, Order, OrderStatus } from '../../data/orders';

const ORDER_TABS = [
  { id: 'all', name: 'All' },
  { id: 'pending_payment', name: 'Pending Payment' },
  { id: 'pending_delivery', name: 'Pending Delivery' },
  { id: 'delivering', name: 'Delivering' },
  { id: 'completed', name: 'Completed' },
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'pending_payment':
      return '#ff9800';
    case 'pending_delivery':
      return '#2196f3';
    case 'delivering':
      return '#9c27b0';
    case 'completed':
      return '#4caf50';
    default:
      return '#666';
  }
};

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case 'pending_payment':
      return 'Pending Payment';
    case 'pending_delivery':
      return 'Pending Delivery';
    case 'delivering':
      return 'Delivering';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // 模拟刷新操作
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const filteredOrders = useCallback(() => {
    if (selectedTab === 'all') {
      return orders;
    }
    return orders.filter(order => order.status === selectedTab);
  }, [selectedTab]);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
      <View style={styles.orderBody}>
        <Text style={styles.orderAmount}>Total: ${item.totalAmount.toFixed(2)}</Text>
        <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
      <View style={styles.orderActions}>
        {item.status === 'pending_payment' && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
        {item.status === 'delivering' && (
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Track Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
          <Text style={styles.headerTitle}>Orders</Text>
        </View>

        {/* Order Status Tabs */}
        <View style={styles.tabsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
            contentContainerStyle={styles.tabsContent}
          >
            {ORDER_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  selectedTab === tab.id && styles.tabButtonActive
                ]}
                onPress={() => setSelectedTab(tab.id)}
              >
                <Text style={[
                  styles.tabName,
                  selectedTab === tab.id && styles.tabNameActive
                ]}>{tab.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Orders List */}
        <FlatList
          data={filteredOrders()}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
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
  tabsWrapper: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabsContainer: {
    height: '100%',
  },
  tabsContent: {
    paddingHorizontal: 20,
    height: '100%',
  },
  tabButton: {
    height: '100%',
    paddingHorizontal: 16,
    marginRight: 15,
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#4CAF50',
  },
  tabName: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  tabNameActive: {
    color: '#4CAF50',
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
