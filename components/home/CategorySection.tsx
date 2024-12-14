import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const categories = [
  // 第一行
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
  // 第二行
  {
    id: '5',
    name: 'Lobster',
    icon: '🦞',
    color: '#FF6B6B',
  },
  {
    id: '6',
    name: 'Octopus',
    icon: '🐙',
    color: '#A8E6CF',
  },
  {
    id: '7',
    name: 'Crab',
    icon: '🦀',
    color: '#FFB6B9',
  },
  {
    id: '8',
    name: 'Caviar',
    icon: '🫧',
    color: '#957DAD',
  },
];

export function CategorySection() {
  // 将分类分成两行
  const firstRow = categories.slice(0, 4);
  const secondRow = categories.slice(4);

  const renderRow = (items: typeof categories) => (
    <View style={styles.categoryRow}>
      {items.map((category) => (
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
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoryGrid}>
        {renderRow(firstRow)}
        {renderRow(secondRow)}
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
    gap: 15,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '23%',
    alignItems: 'center',
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
