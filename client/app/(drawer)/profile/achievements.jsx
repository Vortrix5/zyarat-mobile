import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, FlatList } from "react-native";
import AchievementBadge from './_components/AchievementBadge'; // Reuse the badge component

// --- Mock Data (can be passed via params or context later) ---
const allAchievements = [
    { id: 'scan1', title: "First Scan", description: "Scanned your first artifact.", icon: "scan-circle-outline", xp: 50, unlocked: true },
    { id: 'scan10', title: "Artifact Enthusiast", description: "Scanned 10 artifacts.", icon: "albums-outline", xp: 150, unlocked: true },
    { id: 'visit1', title: "First Visit", description: "Visited your first historical site.", icon: "map-outline", xp: 100, unlocked: true },
    { id: 'visit5', title: "Seasoned Traveler", description: "Visited 5 different locations.", icon: "earth-outline", xp: 250, unlocked: false },
    { id: 'share1', title: "Social Historian", description: "Shared an artifact discovery.", icon: "share-social-outline", xp: 75, unlocked: false },
    { id: 'scan50', title: "Master Curator", description: "Scanned 50 artifacts.", icon: "library-outline", xp: 500, unlocked: false },
];
// --- End Mock Data ---

export default function AchievementsScreen() {
    const [achievements] = useState(allAchievements);
    const unlockedAchievements = achievements.filter(a => a.unlocked);
    const lockedAchievements = achievements.filter(a => !a.unlocked);

    const renderSection = ({ title, data }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title} ({data.length})</Text>
            {data.length > 0 ? (
                <FlatList
                    data={data}
                    renderItem={({ item }) => <AchievementBadge achievement={item} />}
                    keyExtractor={(item) => item.id}
                    numColumns={2} // Display in two columns
                    columnWrapperStyle={styles.row}
                    scrollEnabled={false} // Disable FlatList scrolling, rely on ScrollView
                />
            ) : (
                <Text style={styles.noItemsText}>No achievements in this category yet.</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {renderSection({ title: "Unlocked Achievements", data: unlockedAchievements })}
                {renderSection({ title: "Locked Achievements", data: lockedAchievements })}
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
        padding: 15,
    },
    section: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    row: {
        justifyContent: 'space-between',
    },
    noItemsText: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    // AchievementBadge styles are imported, ensure width is compatible with 2 columns
    // If AchievementBadge width is '48%', it should work. Adjust if needed.
});
