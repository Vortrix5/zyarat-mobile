import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AchievementBadge = ({ achievement, small = false }) => {
    if (!achievement) return null;

    return (
        <View style={[styles.achievementBadge, small && styles.achievementBadgeSmall]}>
            <Ionicons name={achievement.icon} size={small ? 24 : 32} color={achievement.unlocked ? "#007AFF" : "#ccc"} />
            {!small && (
                <>
                    <Text style={[styles.achievementTitle, !achievement.unlocked && styles.lockedText]}>{achievement.title}</Text>
                    <Text style={[styles.achievementDesc, !achievement.unlocked && styles.lockedText]}>{achievement.description}</Text>
                    {achievement.unlocked && <Text style={styles.achievementXp}>+{achievement.xp} XP</Text>}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    achievementBadge: {
        backgroundColor: '#f0f8ff',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginBottom: 15,
        width: '48%', // Adjust for 2 columns with space
        borderWidth: 1,
        borderColor: '#e0f0ff',
    },
    achievementBadgeSmall: { // Style for smaller badges if needed
        width: '30%',
        padding: 10,
    },
    achievementTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 8,
        textAlign: 'center',
    },
    achievementDesc: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
    achievementXp: {
        fontSize: 11,
        color: '#007AFF',
        fontWeight: 'bold',
        marginTop: 6,
    },
    lockedText: {
        color: '#aaa',
    },
});

export default AchievementBadge;
