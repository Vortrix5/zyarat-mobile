"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { Link } from "expo-router"
import { router } from "expo-router"

export default function Register() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const handleRegister = () => {
        // Registration logic will go here later
        console.log("Register:", email, password, confirmPassword)

        // Navigate to home tab
        router.replace("/(tabs)/home")
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <Link href="/(auth)/login" style={styles.link}>
                Already have an account? Login here
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: "#007AFF",
        padding: 10,
        borderRadius: 5,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    link: {
        marginTop: 15,
        color: "#007AFF",
    },
})

