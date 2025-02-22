import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

interface ProductImage {
  storage_path: string;
  is_primary: boolean;
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discounted_price: number;
  product: {
    name: string;
    unit: string;
    origin: string;
    images: ProductImage[];
    primary_image?: {
      storage_path: string;
    };
  };
}

interface Address {
  recipient_name: string;
  phone: string;
  street_address: string;
  apartment?: string;
  city: string;
  state: string;
  zip_code: string;
}

interface Order {
  id: string;
  created_at: string;
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  payment_status: 'paid' | 'unpaid' | 'refunded';
  total: number;
  subtotal: number;
  shipping_fee: number;
  notes?: string;
  address: Address;
  items: OrderItem[];
}

interface Profile {
  id: string;
  role: 'user' | 'supplier';
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadOrderDetail();
  }, [id]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('错误', '请先登录');
        return;
      }

      // 获取用户角色
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // 构建查询
      let query = supabase
        .from('orders')
        .select(`
          *,
          shipping_address:addresses!orders_address_id_fkey (
            recipient_name,
            phone,
            street_address,
            apartment,
            city,
            state,
            zip_code
          )
        `)
        .eq('id', id);

      // 如果不是供应商，只能查看自己的订单
      if (profile.role !== 'supplier') {
        query = query.eq('user_id', user.id);
      }

      const { data: orderData, error: orderError } = await query.single();

      if (orderError) throw orderError;

      // 获取订单商品信息，包括商品详情和主图
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products(
            id,
            name,
            unit,
            origin,
            images:product_images(
              storage_path,
              is_primary
            )
          )
        `)
        .eq('order_id', id)
        .order('created_at', { ascending: true });

      if (itemsError) throw itemsError;

      // 处理商品数据，找出主图
      const processedItems = orderItems.map(item => ({
        ...item,
        product: {
          ...item.product,
          primary_image: {
            storage_path: item.product.images.find((img: ProductImage) => img.is_primary)?.storage_path || null
          }
        }
      }));

      setOrder({
        ...orderData,
        address: orderData.shipping_address,
        items: processedItems
      });

      setUserProfile({
        id: user.id,
        role: profile.role
      });
    } catch (error) {
      console.error('Error loading order detail:', error);
      Alert.alert('错误', '加载订单详情失败');
    } finally {
      setLoading(false);
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

  const getPaymentStatusText = (status: Order['payment_status']) => {
    const statusMap = {
      paid: '已支付',
      unpaid: '未支付',
      refunded: '已退款'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: Order['order_status']) => {
    const colorMap = {
      pending: '#f97316',
      confirmed: '#3b82f6',
      processing: '#8b5cf6',
      shipping: '#06b6d4',
      delivered: '#22c55e',
      cancelled: '#ef4444'
    };
    return colorMap[status] || '#000000';
  };

  const handleUpdateStatus = async (newStatus: Order['order_status']) => {
    try {
      setUpdatingStatus(true);
      const { error } = await supabase
        .from('orders')
        .update({ 
          order_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setOrder(prev => prev ? { ...prev, order_status: newStatus } : null);
      setShowStatusModal(false);
      Alert.alert('成功', '订单状态已更新');
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('错误', '更新订单状态失败');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const renderStatusModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showStatusModal}
      onRequestClose={() => setShowStatusModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>更新订单状态</Text>
          
          <ScrollView style={styles.statusList}>
            {['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusOption,
                  order?.order_status === status && styles.statusOptionSelected
                ]}
                onPress={() => handleUpdateStatus(status as Order['order_status'])}
                disabled={updatingStatus}
              >
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(status as Order['order_status']) }]} />
                <Text style={[
                  styles.statusOptionText,
                  order?.order_status === status && styles.statusOptionTextSelected
                ]}>
                  {getStatusText(status as Order['order_status'])}
                </Text>
                {order?.order_status === status && (
                  <Ionicons name="checkmark" size={20} color="#000" style={styles.statusCheckmark} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowStatusModal(false)}
          >
            <Text style={styles.closeButtonText}>关闭</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>订单不存在或无权访问</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: `订单 #${order.id.slice(-8)}`,
          headerBackTitle: '返回'
        }}
      />
      <ScrollView style={styles.scrollView}>
        {/* 订单状态卡片 */}
        <View style={styles.card}>
          <View style={styles.statusContainer}>
            <View style={styles.statusHeader}>
              <Text style={[styles.statusText, { color: getStatusColor(order.order_status) }]}>
                {getStatusText(order.order_status)}
              </Text>
              {userProfile?.role === 'supplier' && (
                <TouchableOpacity
                  style={styles.updateStatusButton}
                  onPress={() => setShowStatusModal(true)}
                >
                  <Text style={styles.updateStatusButtonText}>更新状态</Text>
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.dateText}>
              {format(new Date(order.created_at), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
            </Text>
          </View>
          <Text style={styles.paymentStatus}>
            支付状态：{getPaymentStatusText(order.payment_status)}
          </Text>
        </View>

        {/* 收货地址 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>收货信息</Text>
          <Text style={styles.addressText}>
            {order.address.recipient_name} {order.address.phone}
          </Text>
          <Text style={styles.addressText}>
            {order.address.street_address}
            {order.address.apartment ? ` ${order.address.apartment}` : ''}
          </Text>
          <Text style={styles.addressText}>
            {order.address.city}, {order.address.state} {order.address.zip_code}
          </Text>
        </View>

        {/* 订单商品 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>商品清单</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              {item.product.primary_image?.storage_path && (
                <Image
                  source={{ uri: item.product.primary_image.storage_path }}
                  style={styles.productImage}
                />
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.productName}>{item.product.name}</Text>
                <Text style={styles.productOrigin}>产地：{item.product.origin}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>
                    ¥{item.discounted_price}/{item.product.unit} × {item.quantity}
                  </Text>
                  <Text style={styles.totalPrice}>
                    ¥{(item.discounted_price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 订单金额 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>订单金额</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>商品小计</Text>
            <Text style={styles.amountValue}>¥{order.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>运费</Text>
            <Text style={styles.amountValue}>¥{order.shipping_fee.toFixed(2)}</Text>
          </View>
          <View style={[styles.amountRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>订单总计</Text>
            <Text style={styles.totalValue}>¥{order.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* 订单备注 */}
        {order.notes && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>订单备注</Text>
            <Text style={styles.notes}>{order.notes}</Text>
          </View>
        )}
      </ScrollView>
      {renderStatusModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#ef4444',
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
  },
  paymentStatus: {
    fontSize: 14,
    color: '#666666',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  addressText: {
    fontSize: 14,
    color: '#333333',
    marginBottom: 4,
    lineHeight: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  productOrigin: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    color: '#666666',
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: '500',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666666',
  },
  amountValue: {
    fontSize: 14,
    color: '#333333',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  notes: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  updateStatusButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  updateStatusButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusList: {
    maxHeight: 400,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusOptionSelected: {
    backgroundColor: '#f3f4f6',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  statusOptionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  statusOptionTextSelected: {
    fontWeight: '600',
    color: '#000000',
  },
  statusCheckmark: {
    marginLeft: 8,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
}); 