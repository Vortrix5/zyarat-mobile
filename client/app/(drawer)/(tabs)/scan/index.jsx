import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ScanIndex() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.actionCard}>
                <View style={styles.iconContainer}>
                    <Ionicons name="hourglass" size={80} color="#007AFF" />
                </View>
                <Text style={styles.actionTitle}>Scan Artifacts</Text>
                <Text style={styles.actionDescription}>
                    Point your camera at a Tunisian historical artifact to identify it and learn about its significance
                </Text>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push("/scan/camera")}
                >
                    <Ionicons name="camera" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Start Scanning</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>How it works</Text>
                <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                        <Ionicons name="camera-outline" size={24} color="#007AFF" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoItemTitle}>Take a photo</Text>
                        <Text style={styles.infoItemDescription}>
                            Capture a clear image of the Tunisian artifact
                        </Text>
                    </View>
                </View>
                <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                        <Ionicons name="search-outline" size={24} color="#007AFF" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoItemTitle}>AI Analysis</Text>
                        <Text style={styles.infoItemDescription}>
                            Our system will analyze and identify the artifact
                        </Text>
                    </View>
                </View>
                <View style={styles.infoItem}>
                    <View style={styles.infoIcon}>
                        <Ionicons name="book-outline" size={24} color="#007AFF" />
                    </View>
                    <View style={styles.infoContent}>
                        <Text style={styles.infoItemTitle}>Learn</Text>
                        <Text style={styles.infoItemDescription}>
                            Discover historical information about the artifact
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
    },
    header: {
        padding: 20,
        paddingTop: 30,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eaeaea",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginTop: 5,
    },
    actionCard: {
        margin: 15,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    actionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    actionDescription: {
        fontSize: 15,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
    },
    actionButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
    infoSection: {
        margin: 15,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
    },
    infoItem: {
        flexDirection: "row",
        marginBottom: 15,
        alignItems: "center",
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 122, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    infoContent: {
        flex: 1,
    },
    infoItemTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    infoItemDescription: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
});
