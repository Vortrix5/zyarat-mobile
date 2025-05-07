import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type TicketFilterType = 'All' | 'Upcoming' | 'Past';
const filters = ['All', 'Upcoming', 'Past'];


const TicketFilter = React.memo(({ selectedFilter, onSelectFilter }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.map((filter) => {
          const isSelected = filter === selectedFilter;
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterItem, isSelected && styles.selectedFilterItem]}
              onPress={() => onSelectFilter(filter)}
            >
              <Text style={[styles.filterText, isSelected && styles.selectedFilterText]}>
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

export default TicketFilter;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  filterItem: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedFilterItem: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
