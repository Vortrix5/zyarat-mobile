import React, { useState, useMemo, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import CategoryList from './_components/CategoryList';
import FeaturedCard from './_components/FeaturedCard';
import SearchBar from './_components/SearchBar';

// Add the export keyword here
export const featuredData = [
  {
    id: '4', // Unique ID
    title: 'Ancient Roman Mosaic',
    description: 'Uncover the beauty of Roman artistry found in El Jem. This intricate mosaic depicts scenes of daily life and mythology.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Alexander_the_Great_mosaic.jpg', // Use the same image as home
    category: 'Historical Sites', // Assign a relevant category
    price: 15, // Example price
    location: 'El Jem', // Example location
  },
  {
    id: '1',
    title: 'Grand Museum Exhibit',
    description: 'Explore ancient artifacts from around the world in this stunning display.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1676185844427-4e047f9a77f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Museum',
    price: 25,
    location: 'Downtown',
  },
  {
    id: '2',
    title: 'City History Tour',
    description: 'A guided walk through the historic downtown, uncovering hidden gems.',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1677182465838-dd2f0a21fd33?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Tour',
    price: 'Free',
    location: 'Old Quarter',
  },
  {
    id: '3',
    title: 'Modern Art Gallery Opening',
    description: 'Featuring new works by local artists. Includes complimentary drinks.',
    imageUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Art Gallery',
    price: 10,
    location: 'Arts District',
  },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All'); // Default to 'All'

  const filteredData = useMemo(() => {
    return featuredData.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const renderListHeader = useCallback(() => (
    <View>
      <CategoryList
        selectedCategory={selectedCategory} // Pass current selection
        onSelectCategory={setSelectedCategory} // Pass setter function
      />
      <Text style={styles.featuredTitle}>Featured</Text>
    </View>
  ), [selectedCategory]); // Only depends on selectedCategory now

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery} // Pass setter function
        />
      </View>
      <FlatList
        ListHeaderComponent={renderListHeader} // Use the memoized function
        data={filteredData} // Use filtered data
        renderItem={({ item }) => <FeaturedCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No results found.</Text>}
        initialNumToRender={5} // Render fewer items initially
        maxToRenderPerBatch={5} // Render fewer items per batch
        windowSize={10} // Reduce the rendering window size
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: '#f8f9fa',
  },
  listContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});
