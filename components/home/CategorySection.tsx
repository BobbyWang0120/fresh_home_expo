import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { categories } from '../../data/categories';

export function CategorySection() {
  const router = useRouter();

  const handleCategoryPress = (categoryId: string) => {
    router.push({
      pathname: '/(tabs)/categories',
      params: { category: categoryId }
    });
  };

  return (
    <View style={styles.container}>
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
    marginVertical: 10,
    paddingHorizontal: 15,
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
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  categoryNameEn: {
    fontSize: 12,
    color: '#666',
  },
});
