import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useKronodex } from '../../../../contexts/KronodexContext';
import { clearParams, getParams } from '../../../../utils/paramStore';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCAN_XP_EARNED = 15;

export default function ResultsScreen() {
    const [loading, setLoading] = useState(true);
    const [imageUri, setImageUri] = useState(null);
    const [artifactInfo, setArtifactInfo] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [saveModalVisible, setSaveModalVisible] = useState(false);
    const router = useRouter();
    const { addItemToKronodex, isItemInKronodex } = useKronodex();

    useEffect(() => {
        console.log("RESULTS SCREEN MOUNTED IN SCAN FOLDER");

        try {
            const storedResults = getParams('scanResults');
            const globalResults = global.lastScanResults;
            let loadedArtifactInfo = null;

            if (storedResults && storedResults.imageUri) {
                console.log("Using stored results from paramStore");
                setImageUri(storedResults.imageUri);
                if (storedResults.artifactData) {
                    loadedArtifactInfo = storedResults.artifactData;
                    setArtifactInfo(loadedArtifactInfo);
                    console.log("Successfully set artifact info from stored results");
                }
                clearParams('scanResults');
            }
            else if (globalResults && globalResults.imageUri) {
                console.log("Using global results");
                setImageUri(globalResults.imageUri);
                loadedArtifactInfo = globalResults.artifactData;
                setArtifactInfo(loadedArtifactInfo);
                global.lastScanResults = null;
            }
            else {
                console.warn("No results data found in either store!");
            }

            if (loadedArtifactInfo && !loadedArtifactInfo.error) {
                setIsSaved(isItemInKronodex(loadedArtifactInfo.title));
            }

        } catch (err) {
            console.error("Error loading results:", err);
        } finally {
            setLoading(false);
        }
    }, [isItemInKronodex]);

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

    const handleSaveToKronodex = () => {
        if (!artifactInfo || artifactInfo.error || isSaved) return;

        const itemData = {
            id: artifactInfo.title,
            title: artifactInfo.title,
            period: artifactInfo.period,
            description: artifactInfo.description,
            significance: artifactInfo.significance,
            location: artifactInfo.location,
            imageUrl: imageUri,
        };

        const result = addItemToKronodex(itemData);

        if (result.success) {
            setIsSaved(true);
            setSaveModalVisible(true);
        } else {
            Alert.alert("Kronodex Info", result.message);
        }
    };

    const handleCloseSaveModal = () => {
        setSaveModalVisible(false);
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
                                <Ionicons name="location-outline" size={18} color="#007AFF" />
                                <Text style={styles.detailTitle}>Location</Text>
                            </View>
                            <Text style={styles.detailText}>{artifactInfo.location}</Text>
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
                            <TouchableOpacity
                                style={[styles.saveButton, isSaved && styles.saveButtonDisabled]}
                                onPress={handleSaveToKronodex}
                                disabled={isSaved}
                            >
                                <Ionicons name={isSaved ? "checkmark-circle" : "save-outline"} size={18} color={isSaved ? "#4CD964" : "#007AFF"} />
                                <Text style={[styles.saveButtonText, isSaved && styles.saveButtonTextDisabled]}>
                                    {isSaved ? "Saved" : "Save to Kronodex"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                                <Ionicons name="share-outline" size={18} color="#007AFF" />
                                <Text style={styles.shareButtonText}>Share</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.scanButtonFullWidth} onPress={handleScanAnother}>
                            <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
                            <Text style={styles.scanButtonText}>Scan Another</Text>
                        </TouchableOpacity>
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
                                            backgroundColor: "#FF9500"
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={saveModalVisible}
                onRequestClose={handleCloseSaveModal}
            >
                <View style={styles.modalCenteredView}>
                    <View style={styles.modalView}>
                        <Ionicons name="checkmark-circle" size={60} color="#4CD964" style={{ marginBottom: 15 }} />
                        <Text style={styles.modalTitle}>Saved to Kronodex!</Text>
                        <Text style={styles.successText}>
                            {artifactInfo?.title} has been added to your collection.
                        </Text>
                        <View style={styles.modalXpBanner}>
                            <Ionicons name="star" size={16} color="#B8860B" />
                            <Text style={styles.modalXpBannerText}>+{SCAN_XP_EARNED} XP Earned!</Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleCloseSaveModal}
                            style={[styles.modalButton, styles.confirmButton, styles.doneButton]}
                        >
                            <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        marginBottom: 15,
        justifyContent: 'space-between',
    },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#E5F1FF",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        flex: 0.48,
        borderWidth: 1,
        borderColor: '#CCE0FF',
    },
    saveButtonDisabled: {
        backgroundColor: "#E8F5E9",
        borderColor: '#C8E6C9',
    },
    saveButtonText: {
        color: "#007AFF",
        fontSize: 15,
        fontWeight: "600",
        marginLeft: 5,
    },
    saveButtonTextDisabled: {
        color: "#388E3C",
    },
    shareButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F2F2F7",
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 15,
        flex: 0.48,
    },
    shareButtonText: {
        color: "#007AFF",
        fontSize: 15,
        fontWeight: "600",
        marginLeft: 5,
    },
    scanButtonFullWidth: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007AFF",
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 15,
        width: '100%',
        marginTop: 5,
        marginBottom: 30,
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
        marginTop: 20,
        width: '80%',
        paddingVertical: 14,
    },
    modalCenteredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 25,
        paddingBottom: Platform.OS === 'ios' ? 40 : 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },
    successText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    modalXpBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF8DC',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#FFECB3',
    },
    modalXpBannerText: {
        marginLeft: 8,
        color: '#B8860B',
        fontWeight: '600',
        fontSize: 15,
    },
    modalButton: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5,
        flexGrow: 1,
        flexBasis: 0,
    },
    confirmButton: {
        backgroundColor: '#007AFF',
    },
    doneButton: {
        marginTop: 0,
        marginHorizontal: 0,
        width: '100%',
        flexGrow: 0,
        flexBasis: 'auto',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButtonText: {
        color: '#fff',
    },
});
