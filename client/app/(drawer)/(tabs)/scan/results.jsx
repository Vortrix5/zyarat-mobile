import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { clearParams, getParams } from '../../../../utils/paramStore';

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ResultsScreen() {
    const [loading, setLoading] = useState(true);
    const [imageUri, setImageUri] = useState(null);
    const [artifactInfo, setArtifactInfo] = useState(null);
    const router = useRouter();

    // Try to load data from our parameter store or global variable
    useEffect(() => {
        console.log("RESULTS SCREEN MOUNTED IN SCAN FOLDER");

        try {
            // Try to get results from the parameter store first
            const storedResults = getParams('scanResults');

            // If that fails, try the global variable
            const globalResults = global.lastScanResults;

            if (storedResults && storedResults.imageUri) {
                console.log("Using stored results from paramStore");
                setImageUri(storedResults.imageUri);

                if (storedResults.artifactData) {
                    setArtifactInfo(storedResults.artifactData);
                    console.log("Successfully set artifact info from stored results");
                }

                // Clean up after use
                clearParams('scanResults');
            }
            else if (globalResults && globalResults.imageUri) {
                console.log("Using global results");
                setImageUri(globalResults.imageUri);
                setArtifactInfo(globalResults.artifactData);

                // Clean up global variable
                global.lastScanResults = null;
            }
            else {
                console.warn("No results data found in either store!");
            }
        } catch (err) {
            console.error("Error loading results:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleShare = async () => {
        if (!artifactInfo) return;

        try {
            await Share.share({
                message: `I discovered a ${artifactInfo.title} using the Tunisian Artifact Scanner app! ${artifactInfo.description}`,
                url: imageUri
            });
        } catch (error) {
            console.log("Error sharing:", error);
        }
    };

    const handleScanAnother = () => {
        router.push("/scan/camera");
    };

    const handleBack = () => {
        router.push("/scan");
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading results...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#007AFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Analysis Results</Text>
                    <View style={{ width: 24 }} />
                </View>

                {/* Image section */}
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                        onError={() => console.log("Error loading image")}
                    />
                ) : (
                    <View style={styles.noImageContainer}>
                        <Text style={styles.noImageText}>No image available</Text>
                    </View>
                )}

                {/* Results content */}
                {artifactInfo && !artifactInfo.error ? (
                    <View style={styles.resultContainer}>
                        <View style={styles.titleSection}>
                            <Text style={styles.title}>{artifactInfo.title}</Text>
                            <View style={styles.confidenceContainer}>
                                <Text style={styles.confidenceText}>
                                    Confidence: {(artifactInfo.confidence * 100).toFixed(1)}%
                                </Text>
                                <View
                                    style={[
                                        styles.confidenceMeter,
                                        { width: (artifactInfo.confidence * 100) + '%' }
                                    ]}
                                />
                            </View>
                        </View>

                        <View style={styles.detailSection}>
                            <View style={styles.detailHeader}>
                                <Ionicons name="time-outline" size={18} color="#007AFF" />
                                <Text style={styles.detailTitle}>Historical Period</Text>
                            </View>
                            <Text style={styles.detailText}>{artifactInfo.period}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <View style={styles.detailHeader}>
                                <Ionicons name="information-circle-outline" size={18} color="#007AFF" />
                                <Text style={styles.detailTitle}>Description</Text>
                            </View>
                            <Text style={styles.detailText}>{artifactInfo.description}</Text>
                        </View>

                        <View style={styles.detailSection}>
                            <View style={styles.detailHeader}>
                                <Ionicons name="star-outline" size={18} color="#007AFF" />
                                <Text style={styles.detailTitle}>Historical Significance</Text>
                            </View>
                            <Text style={styles.detailText}>{artifactInfo.significance}</Text>
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                                <Ionicons name="share-outline" size={18} color="#007AFF" />
                                <Text style={styles.shareButtonText}>Share</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.scanButton} onPress={handleScanAnother}>
                                <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.scanButtonText}>Scan Another</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={60} color="#FF3B30" />
                        <Text style={styles.errorTitle}>Not a Tunisian Artifact</Text>

                        {artifactInfo && (
                            <View style={styles.confidenceContainer}>
                                <Text style={styles.confidenceText}>
                                    Confidence: {(artifactInfo.confidence * 100).toFixed(1)}%
                                </Text>
                                <View
                                    style={[
                                        styles.confidenceMeter,
                                        {
                                            width: (artifactInfo.confidence * 100) + '%',
                                            backgroundColor: "#FF9500" // Orange for low confidence
                                        }
                                    ]}
                                />
                            </View>
                        )}

                        <TouchableOpacity style={[styles.scanButton, styles.tryAgainButton]} onPress={handleScanAnother}>
                            <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
                            <Text style={styles.scanButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f7f7f7",
    },
    contentContainer: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#f7f7f7",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    backButton: {
        padding: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f7f7f7",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    image: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.8,
        resizeMode: "cover",
    },
    noImageContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E0E0E0",
    },
    noImageText: {
        fontSize: 16,
        color: "#666",
    },
    resultContainer: {
        padding: 20,
    },
    titleSection: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    confidenceContainer: {
        height: 6,
        backgroundColor: "#E0E0E0",
        borderRadius: 3,
        marginTop: 8,
        overflow: "hidden",
    },
    confidenceMeter: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "#4CD964",
        borderRadius: 3,
    },
    confidenceText: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    detailSection: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 16,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    detailHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    detailTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginLeft: 6,
    },
    detailText: {
        fontSize: 15,
        color: "#444",
        lineHeight: 22,
    },
    actionButtons: {
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 30,
    },
    shareButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F2F2F7",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        flex: 1,
        marginRight: 10,
    },
    shareButtonText: {
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 5,
    },
    scanButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007AFF",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        flex: 1,
    },
    scanButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 5,
    },
    errorContainer: {
        padding: 30,
        alignItems: "center",
    },
    errorTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginTop: 15,
        marginBottom: 25,
    },
    tryAgainButton: {
        marginTop: 8, // Add more space between confidence bar and button
    },
});
