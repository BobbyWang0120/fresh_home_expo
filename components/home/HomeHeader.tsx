import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const addresses = [
  {
    id: '1',
    address: 'San Francisco',
    detail: '123 Market St, San Francisco, CA 94105',
  },
  {
    id: '2',
    address: 'Palo Alto',
    detail: '456 University Ave, Palo Alto, CA 94301',
  },
  {
    id: '3',
    address: 'San Jose',
    detail: '789 Coleman Ave, San Jose, CA 95110',
  },
];

export function HomeHeader() {
  const router = useRouter();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);
  const [animation] = useState(new Animated.Value(0));

  const handleAddressPress = () => {
    setShowAddressModal(true);
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleAddressSelect = (address: typeof addresses[0]) => {
    setSelectedAddress(address);
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowAddressModal(false);
    });
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.locationButton} onPress={handleAddressPress}>
        <Ionicons name="location-outline" size={20} color="#333" />
        <Text style={styles.locationText}>{selectedAddress.address}</Text>
        <Ionicons 
          name={showAddressModal ? "chevron-up" : "chevron-down"} 
          size={16} 
          color="#666" 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.cartButton}
        onPress={() => router.push('/cart')}
      >
        <View style={styles.cartContainer}>
          <Ionicons name="cart-outline" size={24} color="#333" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={showAddressModal}
        transparent
        animationType="none"
        onRequestClose={() => setShowAddressModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            Animated.timing(animation, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }).start(() => {
              setShowAddressModal(false);
            });
          }}
        >
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={(e) => e.stopPropagation()}
          >
            <Animated.View 
              style={[
                styles.addressesContainer,
                {
                  transform: [{
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0]
                    })
                  }],
                  opacity: animation
                }
              ]}
            >
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.addressItem,
                    selectedAddress.id === address.id && styles.addressItemSelected
                  ]}
                  onPress={() => handleAddressSelect(address)}
                >
                  <View style={styles.addressContent}>
                    <Text style={styles.addressName}>{address.address}</Text>
                    <Text style={styles.addressDetail}>{address.detail}</Text>
                  </View>
                  {selectedAddress.id === address.id && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              ))}
            </Animated.View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
    zIndex: 1,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  addressesContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 110,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  addressItemSelected: {
    backgroundColor: '#F8F8F8',
  },
  addressContent: {
    flex: 1,
    marginRight: 16,
  },
  addressName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  addressDetail: {
    fontSize: 14,
    color: '#666',
    letterSpacing: -0.1,
  },
});
