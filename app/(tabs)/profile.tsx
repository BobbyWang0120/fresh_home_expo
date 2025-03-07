/**
 * Profile Screen Component
 * 
 * This component handles user authentication and profile display:
 * - Displays login/signup forms for unauthenticated users
 * - Shows user profile information for authenticated users
 * - Manages persistent authentication state
 */

import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { Session } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Define the Profile type
type Profile = {
  id: string;
  role: 'user';
  email: string;
  phone?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
};

// Define the Address type
type Address = {
  id: string;
  type: 'home' | 'work' | 'other';
  is_default: boolean;
  recipient_name: string;
  phone: string;
  street_address: string;
  apartment?: string;
  city: string;
  state: string;
  zip_code: string;
  created_at: string;
  updated_at: string;
};

export default function ProfileScreen() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [supplierErrorMessage, setSupplierErrorMessage] = useState('');
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'home',
    is_default: false,
    recipient_name: '',
    phone: '',
    street_address: '',
    apartment: '',
    city: '',
    state: '',
    zip_code: '',
  });

  useEffect(() => {
    // Check for existing session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        fetchAddresses(session.user.id);
      }
      setLoading(false);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
        fetchAddresses(session.user.id);
      } else {
        setProfile(null);
        setAddresses([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      Alert.alert('错误', error.message);
    }
  };

  const fetchAddresses = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data);
    } catch (error: any) {
      Alert.alert('错误', error.message);
    }
  };

  const handleAuth = async () => {
    try {
      // Clear any existing error messages
      setErrorMessage('');
      setSupplierErrorMessage('');
      
      setLoading(true);
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setErrorMessage('邮箱或密码不正确，请重试。');
          return;
        }
        
        // Check if user is a supplier after successful login
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          setErrorMessage('获取用户信息失败，请重试。');
          return;
        }
        
        // If user is a supplier, sign them out and show error message in Chinese
        if (profileData.role === 'supplier') {
          await supabase.auth.signOut();
          setSupplierErrorMessage('供应商账号不允许登录移动应用，请使用供应商网站。');
          return;
        }
      } else {
        // For registration
        if (!email || !password) {
          setErrorMessage('请填写所有必填项。');
          return;
        }
        
        if (password.length < 6) {
          setErrorMessage('密码长度不能少于6个字符。');
          return;
        }
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) {
          if (error.message.includes('email')) {
            setErrorMessage('邮箱格式不正确或已被注册。');
          } else {
            setErrorMessage(`注册失败: ${error.message}`);
          }
          return;
        }
        
        setErrorMessage('');
        // Show success message inline
        setSupplierErrorMessage('账号创建成功！请检查邮箱完成验证。');
      }
    } catch (error: any) {
      setErrorMessage(`操作失败: ${error.message}`);
    } finally {
      setLoading(false);
      setPassword('');
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      Alert.alert('错误', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    try {
      if (!session?.user?.id) return;

      // Validate required fields
      const requiredFields = ['recipient_name', 'phone', 'street_address', 'city', 'state', 'zip_code'];
      const missingFields = requiredFields.filter(field => !newAddress[field as keyof typeof newAddress]);
      
      if (missingFields.length > 0) {
        Alert.alert('提示', '请填写所有必填项');
        return;
      }

      const { data, error } = await supabase
        .from('addresses')
        .insert([
          {
            ...newAddress,
            user_id: session.user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // If this is the first address, make it default
      if (addresses.length === 0) {
        const { error: updateError } = await supabase
          .from('addresses')
          .update({ is_default: true })
          .eq('id', data.id);

        if (updateError) throw updateError;
      }

      setAddresses(prev => [...prev, data]);
      setShowAddressForm(false);
      setNewAddress({
        type: 'home',
        is_default: false,
        recipient_name: '',
        phone: '',
        street_address: '',
        apartment: '',
        city: '',
        state: '',
        zip_code: '',
      });

      Alert.alert('成功', '地址添加成功');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      // First, remove default from all addresses
      const { error: resetError } = await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', session?.user?.id);

      if (resetError) throw resetError;

      // Then set the selected address as default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      if (error) throw error;

      // Update local state
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        is_default: addr.id === addressId
      })));

      Alert.alert('成功', '默认地址已更新');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;

      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      Alert.alert('成功', '地址已删除');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const renderAddressForm = () => (
    <View style={styles.formSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>添加新地址</Text>
        <TouchableOpacity
          style={styles.cancelFormButton}
          onPress={() => setShowAddressForm(false)}
        >
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.formRowGroup}>
        <Text style={styles.formGroupLabel}>联系信息</Text>
        <View style={styles.formRow}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="收件人姓名"
            value={newAddress.recipient_name}
            onChangeText={(text) => setNewAddress(prev => ({ ...prev, recipient_name: text }))}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="手机号码"
            value={newAddress.phone}
            onChangeText={(text) => setNewAddress(prev => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.formRowGroup}>
        <Text style={styles.formGroupLabel}>地址信息</Text>
        <TextInput
          style={styles.input}
          placeholder="街道地址"
          value={newAddress.street_address}
          onChangeText={(text) => setNewAddress(prev => ({ ...prev, street_address: text }))}
        />

        <TextInput
          style={styles.input}
          placeholder="门牌号 (可选)"
          value={newAddress.apartment}
          onChangeText={(text) => setNewAddress(prev => ({ ...prev, apartment: text }))}
        />

        <View style={styles.formRow}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="城市"
            value={newAddress.city}
            onChangeText={(text) => setNewAddress(prev => ({ ...prev, city: text }))}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="省份"
            value={newAddress.state}
            onChangeText={(text) => setNewAddress(prev => ({ ...prev, state: text }))}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="邮政编码"
          value={newAddress.zip_code}
          onChangeText={(text) => setNewAddress(prev => ({ ...prev, zip_code: text }))}
          keyboardType="number-pad"
        />
      </View>

      <View style={styles.formRowGroup}>
        <Text style={styles.formGroupLabel}>地址类型</Text>
        <View style={styles.formRow}>
          <TouchableOpacity
            style={[styles.addressTypeButton, newAddress.type === 'home' && styles.addressTypeButtonActive]}
            onPress={() => setNewAddress(prev => ({ ...prev, type: 'home' }))}
          >
            <Text style={[styles.addressTypeText, newAddress.type === 'home' && styles.addressTypeTextActive]}>家</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addressTypeButton, newAddress.type === 'work' && styles.addressTypeButtonActive]}
            onPress={() => setNewAddress(prev => ({ ...prev, type: 'work' }))}
          >
            <Text style={[styles.addressTypeText, newAddress.type === 'work' && styles.addressTypeTextActive]}>公司</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addressTypeButton, newAddress.type === 'other' && styles.addressTypeButtonActive]}
            onPress={() => setNewAddress(prev => ({ ...prev, type: 'other' }))}
          >
            <Text style={[styles.addressTypeText, newAddress.type === 'other' && styles.addressTypeTextActive]}>其他</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formActions}>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleAddAddress}
        >
          <Text style={styles.submitButtonText}>保存地址</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAddresses = () => (
    <View style={styles.addressesSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>收货地址</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddressForm(true)}
        >
          <Text style={styles.addButtonText}>添加新地址</Text>
        </TouchableOpacity>
      </View>

      {addresses.map(address => (
        <View key={address.id} style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <View style={styles.addressType}>
              <Text style={styles.addressTypeLabel}>
                {address.type === 'home' ? '家' : address.type === 'work' ? '公司' : '其他'}
              </Text>
              {address.is_default && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>默认</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteAddress(address.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.recipientInfo}>
            {address.recipient_name} {address.phone}
          </Text>
          <Text style={styles.addressText}>
            {address.street_address}
            {address.apartment ? `, ${address.apartment}` : ''}
          </Text>
          <Text style={styles.addressText}>
            {address.city}, {address.state} {address.zip_code}
          </Text>

          {!address.is_default && (
            <TouchableOpacity
              style={styles.setDefaultButton}
              onPress={() => handleSetDefaultAddress(address.id)}
            >
              <Text style={styles.setDefaultButtonText}>设为默认</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={[styles.container, styles.centerContent]}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{isLogin ? '登录账号' : '创建账号'}</Text>
            <View style={styles.decorativeLine} />
          </View>
          
          <View style={styles.formContainer}>
            {supplierErrorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{supplierErrorMessage}</Text>
              </View>
            ) : null}
            
            <TextInput
              style={[styles.input, errorMessage ? styles.inputError : null]}
              placeholder="邮箱地址"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrorMessage('');
                setSupplierErrorMessage('');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#666666"
            />
            
            <TextInput
              style={[styles.input, errorMessage ? styles.inputError : null]}
              placeholder="密码"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage('');
                setSupplierErrorMessage('');
              }}
              secureTextEntry
              placeholderTextColor="#666666"
            />
            
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
              </View>
            ) : null}
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleAuth}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {isLogin ? '登录' : '注册'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => {
                setIsLogin(!isLogin);
                setErrorMessage('');
                setSupplierErrorMessage('');
              }}
              style={styles.switchButton}
            >
              <Text style={styles.switchText}>
                {isLogin ? '没有账号？立即注册' : '已有账号？立即登录'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>个人中心</Text>
          <View style={styles.decorativeLine} />
        </View>

        <View style={styles.profileContainer}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>基本信息</Text>
            <View style={styles.infoItem}>
              <Text style={styles.label}>邮箱</Text>
              <Text style={styles.value}>{profile?.email || session.user.email}</Text>
            </View>
            
            {profile?.display_name && (
              <View style={styles.infoItem}>
                <Text style={styles.label}>用户名</Text>
                <Text style={styles.value}>{profile.display_name}</Text>
              </View>
            )}
            
            {profile?.phone && (
              <View style={styles.infoItem}>
                <Text style={styles.label}>手机号码</Text>
                <Text style={styles.value}>{profile.phone}</Text>
              </View>
            )}
            
            <View style={styles.infoItem}>
              <Text style={styles.label}>注册时间</Text>
              <Text style={styles.value}>
                {new Date(profile?.created_at || '').toLocaleDateString('zh-CN')}
              </Text>
            </View>
          </View>
        </View>

        {showAddressForm ? renderAddressForm() : renderAddresses()}

        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>退出登录</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 50, // Add some padding to adjust vertical position
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  decorativeLine: {
    width: 40,
    height: 2,
    backgroundColor: '#000000',
    borderRadius: 1,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#000000',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#000000',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  switchText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  profileContainer: {
    paddingHorizontal: 20,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  signOutButton: {
    backgroundColor: '#000000',
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addressesSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  defaultBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 4,
  },
  recipientInfo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  setDefaultButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#000',
    alignSelf: 'flex-start',
  },
  setDefaultButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  formSection: {
    padding: 20,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  halfInput: {
    width: '48%',
  },
  addressTypeButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  addressTypeButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  addressTypeText: {
    fontSize: 14,
    color: '#666',
  },
  addressTypeTextActive: {
    color: '#fff',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#000',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formRowGroup: {
    marginBottom: 20,
  },
  formGroupLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  cancelFormButton: {
    padding: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorMessage: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
});
