import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

// Define props interface
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

// Wrap the component definition for memoization
const SearchBar = React.memo(({ value, onChangeText }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="gray" style={styles.icon} />
      <TextInput
        placeholder="Search places, categories..."
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
});

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Light gray background
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
