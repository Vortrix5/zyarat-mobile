import { Ionicons } from "@expo/vector-icons";
import { Tabs, useNavigation } from "expo-router"; // Import useNavigation
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"; // Import TouchableOpacity
import { useTickets } from '../../../contexts/TicketsContext';
import { DrawerActions } from '@react-navigation/native'; // Import DrawerActions

// Simple Badge Component
const TabBarBadge = ({ count }) => {
    if (count === 0) return null;
    return (
        <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
        </View>
    );
};

export default function TabsLayout() {
    const { upcomingTicketCount } = useTickets();
    const navigation = useNavigation(); // Get navigation object

    return (
        <Tabs
            screenOptions={{
                headerShown: true, // Enable header for Tab screens
                headerTitleStyle: { fontWeight: 'bold' }, // Optional: Style header title
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: '#e0e0e0',
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                // Explicitly add the drawer toggle button
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                        style={{ marginLeft: 15 }} // Add some margin
                    >
                        <Ionicons name="menu" size={28} color="#007AFF" />
                    </TouchableOpacity>
                ),
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home", // This will be the header title
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explore", // This will be the header title
                    tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="tickets"
                options={{
                    title: "My Tickets", // This will be the header title
                    tabBarIcon: ({ color, size }) => (
                        <View>
                            <Ionicons name="ticket" size={size} color={color} />
                            <TabBarBadge count={upcomingTicketCount} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="scan"
                options={{
                    title: "Scan Artifact", // This will be the header title
                    tabBarIcon: ({ color, size }) => <Ionicons name="scan" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}

// Styles for the custom badge
const styles = StyleSheet.create({
    badgeContainer: {
        position: 'absolute',
        right: -8,
        top: -3,
        backgroundColor: 'red',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

