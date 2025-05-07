import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StatItem = ({ icon, value, label }) => (
    <View style={styles.statItem}>
        <Ionicons name={icon} size={24} color="#007AFF" />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    statLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
        textAlign: 'center',
    },
});

export default StatItem;
