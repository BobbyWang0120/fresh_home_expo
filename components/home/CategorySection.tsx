import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const categories = [
  {
    id: '1',
    name: 'Fish',
    icon: '🐟',
    color: '#4A90E2',
  },
  {
    id: '2',
    name: 'Shellfish',
    icon: '🦐',
    color: '#E17055',
  },
  {
    id: '3',
    name: 'Mollusks',
    icon: '🦪',
    color: '#00B894',
  },
  {
    id: '4',
    name: 'Delicacies',
    icon: '🦑',
    color: '#FDCB6E',
  },
];

export function CategorySection() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => {}}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 26,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
