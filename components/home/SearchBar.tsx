import React, { useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onFocus: () => void;
  onBack: () => void;
  isSearchMode: boolean;
}

export function SearchBar({ onFocus, onBack, isSearchMode }: SearchBarProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <TouchableOpacity 
          onPress={() => {
            if (isSearchMode) {
              onBack();
            }
          }}
          style={styles.iconContainer}
        >
          <Ionicons 
            name={isSearchMode ? "arrow-back" : "search"} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search fresh products..."
          placeholderTextColor="#999"
          onFocus={onFocus}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 44,
  },
  iconContainer: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
