import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Dimensions,
    SafeAreaView,
    Image,
    Animated,
    Alert,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { useRouter } from "expo-router";
import { setParams } from '../../../../utils/paramStore';
import { checkServerHealth, analyzeImageWithServer } from '../../../../utils/serverApi';

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function CameraScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [facing, setFacing] = useState("back");
    const [analyzing, setAnalyzing] = useState(false);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [serverConnected, setServerConnected] = useState(true);
    const cameraRef = useRef(null);
    const router = useRouter();

    const scanLineAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (analyzing) {
            startScanningAnimation();
        } else {
            scanLineAnim.setValue(0);
            scanLineAnim.stopAnimation();
        }
    }, [analyzing]);

    const startScanningAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(scanLineAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    useEffect(() => {
        (async () => {
            try {
                // Request camera permissions
                const { status } = await Camera.requestCameraPermissionsAsync();
                console.log("Camera permission status:", status);
                setHasPermission(status === 'granted');
            } catch (error) {
                console.error("Error in initialization:", error);
            }
        })();
    }, []);

    useEffect(() => {
        const checkConnection = async () => {
            const health = await checkServerHealth();
            setServerConnected(health.success);
            if (!health.success) {
                Alert.alert(
                    "Server Connection Issue",
                    "Could not connect to the analysis server. Please check your server and network settings."
                );
            }
        };

        checkConnection();
    }, []);

    const analyzeImage = async (uri) => {
        try {
            setAnalyzing(true);
            console.log("Starting image analysis");

            // Check server connectivity first
            if (!serverConnected) {
                const healthCheck = await checkServerHealth();
                if (!healthCheck.success) {
                    Alert.alert(
                        "Server Unavailable",
                        "Cannot connect to the analysis server. Make sure the server is running and update the API_URL in serverApi.js with your computer's IP address."
                    );
                    setAnalyzing(false);
                    return;
                } else {
                    setServerConnected(true);
                }
            }

            // Resize and compress the image for faster upload
            const manipResult = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 900 } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );

            // Send image to server for analysis
            const result = await analyzeImageWithServer(manipResult.uri);

            if (!result.success) {
                throw new Error(result.error || "Server analysis failed");
            }

            console.log("Server analysis complete:", result);

            // Store data in the param store for reliable access
            setParams('scanResults', {
                imageUri: manipResult.uri,
                artifactData: result.data
            });

            // Set a global variable as backup
            global.lastScanResults = {
                imageUri: manipResult.uri,
                artifactData: result.data
            };

            // Wait a moment for animation
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Clean up everything first
            setAnalyzing(false);
            setCapturedPhoto(null);

            console.log("NAVIGATING TO NESTED RESULTS");

            // Navigate to the nested route
            router.replace("/scan/results");
        } catch (error) {
            console.error("Analysis error:", error);
            setServerConnected(false);
            Alert.alert(
                "Analysis Failed",
                "Couldn't analyze the image. Please check your server connection and IP address settings."
            );
            setAnalyzing(false);
            setCapturedPhoto(null);
        }
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                console.log("Taking picture");
                const photo = await cameraRef.current.takePictureAsync();
                console.log("Picture taken:", photo.uri);
                setCapturedPhoto(photo.uri);
                await analyzeImage(photo.uri);
            } catch (error) {
                console.log("Error taking picture:", error);
                Alert.alert("Error", "Failed to take picture. Please try again.");
            }
        }
    };

    const handleCloseCamera = () => {
        if (analyzing) {
            Alert.alert(
                "Analysis in Progress",
                "Do you want to cancel the analysis?",
                [
                    { text: "Continue Analyzing", style: "cancel" },
                    {
                        text: "Cancel",
                        style: "destructive",
                        onPress: () => {
                            setAnalyzing(false);
                            setCapturedPhoto(null);
                            router.back();
                        }
                    }
                ]
            );
        } else {
            router.back();
        }
    };

    if (hasPermission === null) {
        return <View style={styles.container}><Text style={styles.statusText}>Requesting camera permission...</Text></View>;
    }

    if (hasPermission === false) {
        return <View style={styles.container}><Text style={styles.statusText}>No access to camera</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cameraContainer}>
                {capturedPhoto ? (
                    <View style={styles.capturedImageContainer}>
                        <Image source={{ uri: capturedPhoto }} style={styles.capturedImage} />

                        {analyzing && (
                            <>
                                <Animated.View
                                    style={[
                                        styles.scanLine,
                                        { transform: [{ translateY: scanLineAnim }] }
                                    ]}
                                />
                                <View style={styles.analysisOverlay}>
                                    <ActivityIndicator size="large" color="#FFFFFF" />
                                    <Text style={styles.analysisText}>Analyzing artifact...</Text>
                                </View>
                            </>
                        )}

                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseCamera}>
                            <Ionicons name="close" size={28} color="white" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Camera view
                    <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing={facing}
                        ratio="16:9"
                    >
                        <View style={styles.headerControls}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleCloseCamera}
                            >
                                <Ionicons name="close" size={28} color="white" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.cameraControlsContainer}>
                            <TouchableOpacity
                                style={styles.flipButton}
                                onPress={() => {
                                    setFacing(facing === "back" ? "front" : "back");
                                }}
                            >
                                <Ionicons name="camera-reverse" size={28} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={takePicture}
                            >
                                <View style={styles.captureButtonInner} />
                            </TouchableOpacity>

                            <View style={styles.spacer} />
                        </View>
                    </CameraView>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    statusText: {
        color: "#fff",
        textAlign: "center",
        padding: 20,
    },
    cameraContainer: {
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
    },
    camera: {
        flex: 1,
        justifyContent: "space-between",
    },
    headerControls: {
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 15,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 10,
    },
    cameraControlsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingBottom: 40,
    },
    spacer: {
        width: 50,
    },
    flipButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    captureButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
    },
    disabledButton: {
        opacity: 0.5,
    },
    captureButtonInner: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#fff",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    loadingText: {
        color: "white",
        marginTop: 10,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    permissionText: {
        color: '#FFF',
        fontSize: 16,
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
        paddingHorizontal: 30,
    },
    permissionButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    permissionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    capturedImageContainer: {
        flex: 1,
        position: 'relative',
    },
    capturedImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    scanLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 6,
        backgroundColor: '#FFFFFF',
        zIndex: 5,
        width: SCREEN_WIDTH,
        opacity: 0.7,
    },
    analysisOverlay: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 12,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
    },
    analysisText: {
        color: '#FFFFFF',
        fontSize: 16,
        marginLeft: 10,
        fontWeight: '500',
    },
});
