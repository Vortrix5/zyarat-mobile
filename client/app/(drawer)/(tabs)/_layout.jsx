import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { View } from "react-native"

export default function TabsLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        borderTopWidth: 1,
                        borderTopColor: '#e0e0e0',
                    },
                    contentStyle: {
                        flex: 1, // Ensure content takes full height
                    }
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="explore"
                    options={{
                        title: "Explore",
                        tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="tickets"
                    options={{
                        title: "Tickets",
                        tabBarIcon: ({ color, size }) => <Ionicons name="ticket" size={size} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="scan"
                    options={{
                        title: "Scan",
                        tabBarIcon: ({ color, size }) => <Ionicons name="scan" size={size} color={color} />,
                    }}
                />
            </Tabs>
        </View>
    )
}

