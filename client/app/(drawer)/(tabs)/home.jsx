import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import FeaturedCard from "./explore/_components/FeaturedCard";
import { featuredData } from "./explore/index";

const featuredMosaic = featuredData.find(item => item.id === '4');

export default function Home() {
    const router = useRouter();

    const handleNavigation = (path) => {
        router.push(path);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Welcome Back!</Text>
                    <Text style={styles.subGreeting}>Ready to explore Tunisia's history?</Text>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActionsContainer}>
                    <TouchableOpacity
                        style={[styles.actionCard, styles.scanCard]}
                        onPress={() => handleNavigation('/scan')}
                    >
                        <Ionicons name="scan-outline" size={36} color="#FFFFFF" />
                        <Text style={styles.actionCardText}>Scan Artifact</Text>
                        <Text style={styles.actionCardSubText}>Identify historical items instantly</Text>
                    </TouchableOpacity>

                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={[styles.actionCard, styles.exploreCard]}
                            onPress={() => handleNavigation('/explore')}
                        >
                            <Ionicons name="map-outline" size={28} color="#8B4513" />
                            <Text style={styles.actionCardTextSmall}>Explore Places</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionCard, styles.ticketsCard]}
                            onPress={() => handleNavigation('/tickets')}
                        >
                            <Ionicons name="ticket-outline" size={28} color="#2E8B57" />
                            <Text style={styles.actionCardTextSmall}>My Tickets</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Featured Section */}
                <View style={styles.featuredSection}>
                    <Text style={styles.sectionTitle}>Featured Discovery</Text>
                    {featuredMosaic ? (
                        <FeaturedCard item={featuredMosaic} />
                    ) : (
                        <Text style={styles.errorText}>Featured item not found.</Text>
                    )}
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
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 30,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    subGreeting: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    quickActionsContainer: {
        marginBottom: 30,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    actionCard: {
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    scanCard: {
        backgroundColor: '#007AFF',
        width: '100%',
        minHeight: 120,
    },
    exploreCard: {
        backgroundColor: '#eaf5ff',
        width: '48%',
        minHeight: 100,
    },
    ticketsCard: {
        backgroundColor: '#e8f9f0',
        width: '48%',
        minHeight: 100,
    },
    actionCardText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 8,
    },
    actionCardSubText: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 2,
    },
    actionCardTextSmall: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 8,
        color: '#333',
        textAlign: 'center',
    },
    featuredSection: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 10,
    }
});

