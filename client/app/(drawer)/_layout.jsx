import { Ionicons } from "@expo/vector-icons"
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer"
import { router } from "expo-router"; // Import only router
import { Drawer } from "expo-router/drawer"
import React from "react"; // Removed useEffect import
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

function CustomDrawerContent(props) {
    const handleLogout = () => {
        console.log("Logging out...")
        router.replace("/login")
    }

    return (
        <View style={styles.drawerContainer}>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
                <View style={styles.drawerContent}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={styles.drawerFooter}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="white" />
                    <Text style={styles.logoutButtonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default function Layout() {
    return (
        <Drawer
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerType: "front",
                drawerStyle: {
                    backgroundColor: "#fff",
                    width: '80%',
                    maxWidth: 300,
                },
                headerShown: false, // Default to no header from Drawer itself
                headerTitleStyle: { fontWeight: 'bold' },
                swipeEnabled: true,
                gestureEnabled: true,
            }}
        >
            <Drawer.Screen
                name="(tabs)" // Represents the Tabs navigator
                options={{
                    drawerLabel: "Home",
                    title: "Home",
                    drawerIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                    headerShown: false, // IMPORTANT: Keep this false for the Tabs group
                }}
            />
            <Drawer.Screen
                name="kronodex"
                options={{
                    drawerLabel: "Kronodex",
                    title: "Kronodex",
                    drawerIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
                    headerShown: true, // Correct: Show header for Kronodex
                }}
            />
            <Drawer.Screen
                name="profile"
                options={{
                    drawerLabel: "Profile",
                    title: "Profile",
                    drawerIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
                    headerShown: true, // Correct: Show header for Profile
                }}
            />
            <Drawer.Screen
                name="settings"
                options={{
                    drawerLabel: "Settings",
                    title: "Settings",
                    drawerIcon: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
                    headerShown: true, // Correct: Show header for Settings
                }}
            />
        </Drawer>
    )
}

const styles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    drawerContent: {
        flex: 1,
    },
    drawerFooter: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        padding: 16,
    },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FF3B30",
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
    },
    logoutButtonText: {
        color: "white",
        fontSize: 16,
        marginLeft: 8,
    },
})

