/**
 * CategorySection.tsx
 * 
 * 功能描述：
 * - 展示商品分类的网格布局组件
 * - 包含中英文分类名称和图标
 * - 点击分类可跳转到对应分类页面
 * 
 * 依赖：
 * - expo-router：用于页面导航
 * - categories数据：来自../../data/categories
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { categories } from '../../data/categories';

export function CategorySection() {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: '/(tabs)/categories',
      params: { category: categoryId }
    });
  };

  const handleViewAll = () => {
    router.push('/(tabs)/categories');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>商品分类</Text>
        <TouchableOpacity onPress={handleViewAll} style={styles.viewAllButton}>
          <Ionicons name="arrow-forward" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryNameEn}>{category.nameEn}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllButton: {
    padding: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryTextContainer: {
    gap: 2,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryNameEn: {
    fontSize: 11,
    color: '#666',
  },
});
