import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const categories = [
  // 第一行
  {
    id: '1',
    name: '鱼类',
    icon: '🐟',
    color: '#4A90E2',
  },
  {
    id: '2',
    name: '虾类',
    icon: '🦐',
    color: '#E17055',
  },
  {
    id: '3',
    name: '贝类',
    icon: '🦪',
    color: '#00B894',
  },
  {
    id: '4',
    name: '海味',
    icon: '🦑',
    color: '#FDCB6E',
  },
  // 第二行
  {
    id: '5',
    name: '龙虾',
    icon: '🦞',
    color: '#FF6B6B',
  },
  {
    id: '6',
    name: '章鱼',
    icon: '🐙',
    color: '#A8E6CF',
  },
  {
    id: '7',
    name: '螃蟹',
    icon: '🦀',
    color: '#FFB6B9',
  },
  {
    id: '8',
    name: '鱼子酱',
    icon: '🫧',
    color: '#957DAD',
  },
];

export function CategorySection() {
  const router = useRouter();
  // 将分类分成两行
  const firstRow = categories.slice(0, 4);
  const secondRow = categories.slice(4);

  const handleViewAll = () => {
    router.push('/(tabs)/categories');
  };

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
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>分类</Text>
        <TouchableOpacity onPress={handleViewAll} style={styles.viewAllButton}>
          <Ionicons name="arrow-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  viewAllButton: {
    padding: 8,
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
