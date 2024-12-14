import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function HomeHeader() {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.locationButton} onPress={() => {}}>
        <Ionicons name="location-outline" size={20} color="#333" />
        <Text style={styles.locationText}>San Francisco</Text>
        <Ionicons name="chevron-down" size={16} color="#666" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.cartButton} onPress={() => {}}>
        <View style={styles.cartContainer}>
          <Ionicons name="cart-outline" size={24} color="#333" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>2</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginHorizontal: 6,
  },
  cartButton: {
    padding: 4,
  },
  cartContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
