import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// --- Mock Data ---
const mockUser = {
    name: "Flen Fouleni",
    email: "alex.explorer@email.com",
    joinDate: "Joined July 2024",
    avatarUrl: "https://images.unsplash.com/photo-1697666516903-ea62a128e48d?q=80&w=1990&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Placeholder avatar
    level: 5,
    currentXP: 650,
    xpToNextLevel: 1000,
    stats: {
        artifactsScanned: 12,
        placesVisited: 4,
        achievementsUnlocked: 3,
    },
};

const allAchievements = [
    { id: 'scan1', title: "First Scan", description: "Scanned your first artifact.", icon: "scan-circle-outline", xp: 50, unlocked: true },
    { id: 'scan10', title: "Artifact Enthusiast", description: "Scanned 10 artifacts.", icon: "albums-outline", xp: 150, unlocked: true },
    { id: 'visit1', title: "First Visit", description: "Visited your first historical site.", icon: "map-outline", xp: 100, unlocked: true },
    { id: 'visit5', title: "Seasoned Traveler", description: "Visited 5 different locations.", icon: "earth-outline", xp: 250, unlocked: false },
    { id: 'share1', title: "Social Historian", description: "Shared an artifact discovery.", icon: "share-social-outline", xp: 75, unlocked: false },
    { id: 'scan50', title: "Master Curator", description: "Scanned 50 artifacts.", icon: "library-outline", xp: 500, unlocked: false },
];

// Assume user can pin some achievements
const pinnedAchievementIds = ['scan10', 'visit1'];
// --- End Mock Data ---

// Helper component for Stats
const StatItem = ({ icon, value, label }) => (
    <View style={styles.statItem}>
        <Ionicons name={icon} size={24} color="#007AFF" />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

// Helper component for Achievements
const AchievementBadge = ({ achievement, small = false }) => (
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

export default function ProfileScreen() { // Renamed component to avoid conflict if needed, though default export is key
    const router = useRouter();
    const [user] = useState(mockUser); // Use state for potential future updates
    const [achievements] = useState(allAchievements);

    const xpPercentage = (user.currentXP / user.xpToNextLevel) * 100;
    const pinnedAchievements = achievements.filter(a => pinnedAchievementIds.includes(a.id) && a.unlocked);
    const lockedAchievements = achievements.filter(a => !a.unlocked);

    const handleViewAllAchievements = () => {
        // Navigate to the achievements screen within the profile stack
        router.push('/profile/achievements'); // Corrected route
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.joinDate}>{user.joinDate}</Text>
                    <View style={styles.levelContainer}>
                        <Text style={styles.levelText}>Level {user.level}</Text>
                    </View>
                </View>

                {/* XP Progress */}
                <View style={styles.xpSection}>
                    <View style={styles.xpLabels}>
                        <Text style={styles.xpText}>XP: {user.currentXP} / {user.xpToNextLevel}</Text>
                        <Text style={styles.xpText}>Next Level</Text>
                    </View>
                    <View style={styles.xpBarBackground}>
                        <View style={[styles.xpBarForeground, { width: `${xpPercentage}%` }]} />
                    </View>
                </View>

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    <StatItem icon="scan-outline" value={user.stats.artifactsScanned} label="Artifacts Scanned" />
                    <StatItem icon="location-outline" value={user.stats.placesVisited} label="Places Visited" />
                    <StatItem icon="trophy-outline" value={user.stats.achievementsUnlocked} label="Achievements" />
                </View>

                {/* Pinned Achievements Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Featured Achievements</Text>
                    {pinnedAchievements.length > 0 ? (
                        <View style={styles.achievementsGrid}>
                            {pinnedAchievements.map(ach => <AchievementBadge key={ach.id} achievement={ach} />)}
                        </View>
                    ) : (
                        <Text style={styles.noItemsText}>No achievements featured yet.</Text>
                    )}
                </View>

                {/* Locked Achievements Preview */}
                <View style={styles.section}>
                    {/* Combined Section Header and Button */}
                    <View style={styles.sectionHeaderWithButton}>
                        <Text style={styles.sectionTitle}>Next Achievements</Text>
                        <TouchableOpacity style={styles.viewAllInlineButton} onPress={handleViewAllAchievements}>
                            <Text style={styles.viewAllInlineButtonText}>View All</Text>
                            <Ionicons name="chevron-forward" size={18} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                    {lockedAchievements.length > 0 ? (
                        <View style={styles.achievementsGrid}>
                            {lockedAchievements.slice(0, 3).map(ach => ( // Show first 3 locked
                                <AchievementBadge key={ach.id} achievement={ach} />
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.noItemsText}>All achievements unlocked!</Text>
                    )}
                    {/* Removed the separate View All button from here */}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    container: {
        paddingBottom: 40, // Add padding at the bottom
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#007AFF',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    joinDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    levelContainer: {
        marginTop: 10,
        backgroundColor: '#eaf5ff',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 15,
    },
    levelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#005bb5',
    },
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
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
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
    section: {
        marginTop: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15, // Keep margin for standalone titles
    },
    sectionHeaderWithButton: { // New style for header row
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15, // Keep margin below header row
    },
    viewAllInlineButton: { // Style for the inline "View All" button
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    viewAllInlineButtonText: { // Style for the inline button text
        color: '#007AFF',
        fontSize: 14,
        fontWeight: '500',
        marginRight: 2,
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Adjust as needed
    },
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
    noItemsText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
    },
    // Removed viewAllButton and viewAllButtonText styles as they are replaced
});
