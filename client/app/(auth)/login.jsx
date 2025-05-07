"use client"

import { Ionicons } from "@expo/vector-icons"
import { Link, router } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        console.log("Login:", email, password)
        // Navigate to home tab after successful login
        router.replace("/(drawer)/(tabs)/home")
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <View style={styles.header}>
                    <Ionicons name="compass-outline" size={60} color="#007AFF" />
                    <Text style={styles.appName}>ZyARat</Text>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Login to continue your journey.</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor="#8E8E93"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#8E8E93" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#8E8E93"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={24} color="#8E8E93" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account?</Text>
                    <Link href="/(auth)/register" asChild>
                        <TouchableOpacity>
                            <Text style={styles.link}>Register here</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F7F7F7",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 25,
    },
    header: {
        alignItems: "center",
        marginBottom: 40,
    },
    appName: {
        fontSize: 36,
        fontWeight: "bold",
        color: "#007AFF",
        marginTop: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: "600",
        color: "#1C1C1E",
        marginTop: 20,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#8E8E93",
        textAlign: "center",
    },
    form: {
        width: "100%",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: "#E5E5EA",
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: "#1C1C1E",
    },
    eyeIcon: {
        padding: 5,
    },
    button: {
        backgroundColor: "#007AFF",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: "white",
        fontSize: 17,
        fontWeight: "600",
    },
    footer: {
        flexDirection: "row",
        marginTop: 30,
        alignItems: "center",
    },
    footerText: {
        fontSize: 15,
        color: "#8E8E93",
    },
    link: {
        marginLeft: 5,
        color: "#007AFF",
        fontSize: 15,
        fontWeight: "600",
    },
})

