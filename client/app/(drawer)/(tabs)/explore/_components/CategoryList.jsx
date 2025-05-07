import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Update categories to match sample data
const baseCategories = ['Museum', 'Tour', 'Art Gallery', 'Historical Sites', 'Parks']; // Adjusted order/content
const categories = ['All', ...baseCategories]; // Add 'All' category

// Define props interface
interface CategoryListProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

// Wrap the component definition for memoization
const CategoryList = React.memo(({ selectedCategory, onSelectCategory }: CategoryListProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => {
          const isSelected = category === selectedCategory; // Check if current category is selected
          return (
            <TouchableOpacity
              key={category}
              // Apply different styles based on selection state
              style={[styles.categoryItem, isSelected && styles.selectedCategoryItem]}
              onPress={() => onSelectCategory(category)} // Call prop callback on press
            >
              <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

export default CategoryList; // Export the memoized component

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryItem: {
    backgroundColor: '#f0f0f0', // Lighter background for unselected
    paddingVertical: 10, // Adjusted padding
    paddingHorizontal: 18, // Adjusted padding
    borderRadius: 20, // More rounded corners
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1, // Add border
    borderColor: '#e0e0e0', // Light border color
  },
  selectedCategoryItem: {
    backgroundColor: '#007AFF', // Primary color for selected background
    borderColor: '#007AFF', // Match border color
  },
  categoryText: {
    fontSize: 14,
    color: '#333', // Darker text for unselected
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF', // White text for selected
    fontWeight: '600',
  },
});
