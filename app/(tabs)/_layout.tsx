import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const activeColor = '#4CAF50';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: '#666',
        headerShown: false,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#f0f0f0',
            },
            android: {
              backgroundColor: '#fff',
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={size} 
              color={focused ? activeColor : '#666'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons 
              name={focused ? "grid" : "grid-outline"} 
              size={size} 
              color={focused ? activeColor : '#666'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons 
              name={focused ? "receipt" : "receipt-outline"} 
              size={size} 
              color={focused ? activeColor : '#666'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={size} 
              color={focused ? activeColor : '#666'} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
