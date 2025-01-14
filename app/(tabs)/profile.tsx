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
import { Colors } from '../../constants/Colors';

// Define the Profile type
type Profile = {
  id: string;
  role: 'user' | 'supplier';
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

  useEffect(() => {
    // Check for existing session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
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
      Alert.alert('Error', error.message);
    }
  };

  const handleAuth = async () => {
    try {
      setLoading(true);
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        Alert.alert('Success', 'Account created successfully!');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
        </View>
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{isLogin ? '登录账号' : '创建账号'}</Text>
            <View style={styles.decorativeLine} />
          </View>
          
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="邮箱地址"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={Colors.light.icon}
            />
            
            <TextInput
              style={styles.input}
              placeholder="密码"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={Colors.light.icon}
            />
            
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
              onPress={() => setIsLogin(!isLogin)}
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
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>个人中心</Text>
          <View style={styles.decorativeLine} />
        </View>

        <View style={styles.profileContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>邮箱</Text>
            <Text style={styles.value}>{session.user.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>角色</Text>
            <Text style={styles.value}>
              {profile?.role === 'supplier' ? '供应商' : '用户'}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>用户 ID</Text>
            <Text style={styles.value}>{session.user.id}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.label}>最近登录</Text>
            <Text style={styles.value}>
              {new Date(session.user.last_sign_in_at || '').toLocaleString()}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>退出登录</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  decorativeLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.light.tint,
    borderRadius: 1,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
    backgroundColor: '#F9FAFB',
    fontSize: 16,
    color: Colors.light.text,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.light.tint,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
  },
  switchText: {
    color: Colors.light.tint,
    fontSize: 14,
    fontWeight: '500',
  },
  profileContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  infoItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.light.icon,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: '500',
  },
  signOutButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
});
