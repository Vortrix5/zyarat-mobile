import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const KronodexItem = ({ item, onRemove }) => {
    return (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPeriod}>{item.period}</Text>
                <Text style={styles.itemLocation}>{item.location}</Text>
            </View>
            <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={22} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    itemDetails: {
        flex: 1, // Take remaining space
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    itemPeriod: {
        fontSize: 13,
        color: '#666',
    },
    itemLocation: { // Added style for location
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    removeButton: {
        padding: 8, // Add padding for easier tapping
        marginLeft: 10, // Space from details
    },
});

export default KronodexItem;
