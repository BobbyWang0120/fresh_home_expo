import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

interface Order {
  id: string;
  created_at: string;
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  payment_status: 'paid' | 'unpaid' | 'refunded';
  total: number;
  subtotal: number;
  shipping_fee: number;
  notes?: string;
  user_id: string;
  user_email?: string;
}

interface Profile {
  id: string;
  role: 'user' | 'supplier';
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  // 监听认证状态变化
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user?.id || null;
      if (userId !== currentUserId) {
        setCurrentUserId(userId);
        if (userId) {
          loadUserProfile(userId);
        } else {
          setOrders([]);
          setUserProfile(null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUserId]);

  // 页面获得焦点时检查并刷新数据
  useFocusEffect(
    React.useCallback(() => {
      const checkAndLoadOrders = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || null;
        
        if (userId) {
          await loadUserProfile(userId);
        } else {
          setOrders([]);
          setUserProfile(null);
          router.push('/(tabs)/profile');
        }
      };

      checkAndLoadOrders();
    }, [])  // Remove currentUserId dependency to ensure refresh on every focus
  );

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(profile);
      loadOrders(profile.role);
    } catch (error) {
      console.error('Error loading user profile:', error);
      Alert.alert('错误', '加载用户信息失败');
    }
  };

  const loadOrders = async (role: 'user' | 'supplier') => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setOrders([]);
        router.push('/(tabs)/profile');
        return;
      }

      // 基本订单查询
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // 如果是普通用户，只显示自己的订单
      if (role === 'user') {
        query = query.eq('user_id', user.id);
      }

      const { data: ordersData, error: ordersError } = await query;

      if (ordersError) throw ordersError;

      // 如果是供应商，需要获取用户邮箱
      if (role === 'supplier' && ordersData) {
        // 获取所有订单相关的用户ID
        const userIds = [...new Set(ordersData.map(order => order.user_id))];
        
        // 为每个用户ID获取邮箱
        const emailPromises = userIds.map(async (userId) => {
          const { data } = await supabase
            .from('auth.users')
            .select('email')
            .eq('id', userId)
            .single();
          return { userId, email: data?.email };
        });

        const userEmails = await Promise.all(emailPromises);
        const userEmailMap = new Map(
          userEmails.map(({ userId, email }) => [userId, email || '未知用户'])
        );

        // 将用户邮箱添加到订单数据中
        const ordersWithUserInfo = ordersData.map(order => ({
          ...order,
          user_email: userEmailMap.get(order.user_id)
        }));

        setOrders(ordersWithUserInfo);
      } else {
        setOrders(ordersData);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      Alert.alert('错误', '加载订单失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (userProfile) {
      loadOrders(userProfile.role);
    }
  };

  const getStatusText = (status: Order['order_status']) => {
    const statusMap = {
      pending: '待处理',
      confirmed: '已确认',
      processing: '处理中',
      shipping: '配送中',
      delivered: '已送达',
      cancelled: '已取消'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: Order['order_status']) => {
    const colorMap = {
      pending: '#F59E0B',    // 橙色
      confirmed: '#6366F1',  // 靛蓝色
      processing: '#3B82F6', // 蓝色
      shipping: '#8B5CF6',   // 紫色
      delivered: '#10B981',  // 绿色
      cancelled: '#EF4444'   // 红色
    };
    return colorMap[status] || '#000000';
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => router.push(`/order/${item.id}`)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.order_status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.order_status)}</Text>
        </View>
      </View>

      {userProfile?.role === 'supplier' && (
        <View style={styles.userInfo}>
          <Text style={styles.userEmail}>买家: {item.user_email || '未知用户'}</Text>
        </View>
      )}

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>订单金额</Text>
          <Text style={styles.detailValue}>¥{item.total.toFixed(2)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>商品小计</Text>
          <Text style={styles.detailValue}>¥{item.subtotal.toFixed(2)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>运费</Text>
          <Text style={styles.detailValue}>¥{item.shipping_fee.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {userProfile?.role === 'supplier' ? '所有订单' : '我的订单'}
        </Text>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>暂无订单</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  listContainer: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 14,
    color: '#666666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  userInfo: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
  },
  detailValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    alignItems: 'flex-end',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
});
