import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const XpSection = ({ currentXP, xpToNextLevel, currentLevel }) => {
    const xpPercentage = (currentXP / xpToNextLevel) * 100;

    return (
        <View style={styles.xpSection}>
            <View style={styles.xpLabels}>
                <Text style={styles.xpText}>XP: {currentXP} / {xpToNextLevel}</Text>
                <Text style={styles.xpText}>Level {currentLevel+1}</Text>
            </View>
            <View style={styles.xpBarBackground}>
                <View style={[styles.xpBarForeground, { width: `${xpPercentage}%` }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    xpSection: {
        padding: 20,
        backgroundColor: '#fff',
        marginVertical: 10,
    },
    xpLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    xpText: {
        fontSize: 13,
        color: '#555',
        fontWeight: '500',
    },
    xpBarBackground: {
        height: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    xpBarForeground: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 5,
    },
});

export default XpSection;
