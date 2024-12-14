import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>Fresh Home</Text>
          <Text style={styles.subtitle}>California Fresh Delivery</Text>
        </View>
        <View style={styles.decorativeLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50', // 更明亮的绿色
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 20,
    color: '#66BB6A', // 更浅的绿色
    letterSpacing: 0.5,
  },
  decorativeLine: {
    width: 80,
    height: 3,
    backgroundColor: '#81C784', // 最浅的绿色
    borderRadius: 1.5,
    marginTop: 24,
  },
});
