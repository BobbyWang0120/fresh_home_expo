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
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

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
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered';
  payment_status: 'paid' | 'unpaid' | 'refunded';
  total: number;
  subtotal: number;
  shipping_fee: number;
  notes?: string;
  address: Address;
  items: OrderItem[];
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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

      // 获取订单详情，包括地址信息
      const { data: orderData, error: orderError } = await supabase
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
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (orderError) throw orderError;

      // 获取订单商品信息，包括商品详情和主图
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          *,
          product:products(
            name,
            unit,
            origin,
            primary_image:product_images(
              storage_path
            )
          )
        `)
        .eq('order_id', id)
        .order('created_at', { ascending: true });

      if (itemsError) throw itemsError;

      // 处理商品主图
      const itemsWithImages = await Promise.all(
        orderItems.map(async (item) => {
          if (item.product.primary_image?.[0]?.storage_path) {
            const { data } = await supabase.storage
              .from('product-images')
              .getPublicUrl(item.product.primary_image[0].storage_path);
            
            return {
              ...item,
              product: {
                ...item.product,
                primary_image: {
                  storage_path: data.publicUrl
                }
              }
            };
          }
          return item;
        })
      );

      setOrder({
        ...orderData,
        address: orderData.shipping_address,
        items: itemsWithImages
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
      processing: '处理中',
      shipped: '已发货',
      delivered: '已送达'
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
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#22c55e'
    };
    return colorMap[status] || '#000000';
  };

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
            <Text style={[styles.statusText, { color: getStatusColor(order.order_status) }]}>
              {getStatusText(order.order_status)}
            </Text>
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
}); 