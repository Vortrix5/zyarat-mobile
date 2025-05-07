import React from 'react'; // Import React
import { StyleSheet, Text, View } from 'react-native'; // Remove Image from here
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Image } from 'expo-image'; // Import Image from expo-image

// Define an interface for the props
interface FeaturedCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category?: string; // Optional category
    price?: string | number; // Optional price (string for 'Free', number for amount)
    location?: string; // Optional location/distance
  };
}

// Define the component function
const FeaturedCardComponent = ({ item }: FeaturedCardProps) => {
  const displayPrice = typeof item.price === 'number' ? `${item.price} TND` : item.price; // Format price

  return (
    <Link
      href={{
        // Use the absolute path from the app root directory
        pathname: `/(drawer)/(tabs)/explore/details/${item.id}`,
        params: {
          title: item.title,
          description: item.description,
          imageUrl: item.imageUrl,
          category: item.category,
          price: item.price,
          location: item.location,
        }
      }}
      style={styles.card}
    >
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
        style={styles.image}
        placeholder={'L6Pj0^i_.AyE_3t7t7R**0o#DgR4'} // Optional: Add a blurhash or placeholder
        contentFit="cover" // Similar to resizeMode
        transition={300} // Optional: fade-in transition
      />
      <View style={styles.textContainer}>
        {/* Category Chip */}
        {item.category && (
          <View style={styles.chipContainer}>
            <Text style={styles.chipText}>{item.category}</Text>
          </View>
        )}

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

        {/* Price and Location Row */}
        <View style={styles.detailsRow}>
          {/* Price */}
          {item.price !== undefined && (
            <View style={styles.priceContainer}>
              <Ionicons name="pricetag-outline" size={14} color="#10B981" />
              <Text style={styles.priceText}>{displayPrice}</Text>
            </View>
          )}
          {/* Location */}
          {item.location && (
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.detailText}>{item.location}</Text>
            </View>
          )}
        </View>
      </View>
    </Link>
  );
};

// Wrap the component with React.memo before exporting
export default React.memo(FeaturedCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12, // Slightly larger radius
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15, // Slightly softer shadow
    shadowRadius: 2.5,
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: 160, // Slightly taller image
    // contentFit replaces resizeMode for expo-image
    // backgroundColor: '#eee', // Optional: Add a background color while loading
  },
  textContainer: {
    padding: 12, // Consistent padding
  },
  chipContainer: {
    backgroundColor: '#e0f2fe', // Light blue background for chip
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start', // Position chip to the left
    marginBottom: 8,
  },
  chipText: {
    color: '#0c4a6e', // Darker blue text for chip
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontSize: 17, // Slightly larger title
    fontWeight: 'bold',
    marginBottom: 4, // Reduced margin
    color: '#111', // Darker title color
  },
  description: {
    fontSize: 14,
    color: '#555', // Slightly darker description
    marginBottom: 10, // Add margin below description
    lineHeight: 20, // Improve readability
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out price and location
    alignItems: 'center',
    marginTop: 5, // Add some space above the row
    borderTopWidth: 1, // Add a subtle separator line
    borderTopColor: '#f0f0f0',
    paddingTop: 10, // Increased padding top
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: { // New style for the price chip
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0FDF4', // Light green background
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  priceText: { // Specific style for price text
    fontSize: 13,
    color: '#047857', // Darker green text
    marginLeft: 4,
    fontWeight: '600', // Make price bold
  },
  detailText: { // Style for other details like location
    fontSize: 13,
    color: '#666',
    marginLeft: 4, // Space between icon and text
  },
});
