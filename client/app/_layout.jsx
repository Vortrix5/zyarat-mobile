import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDebugMode } from '../utils/debug';
import { TicketsProvider } from '../contexts/TicketsContext'; // Import the provider
import { KronodexProvider } from '../contexts/KronodexContext'; // Import the Kronodex provider

// Initialize debug helpers
initDebugMode();

export default function RootLayout() {
    return (
        // Wrap with KronodexProvider (order relative to TicketsProvider might matter depending on dependencies)
        <KronodexProvider>
            <TicketsProvider>
                <SafeAreaProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <Stack
                            screenOptions={{
                                headerShown: false, // Disable headers globally by default
                            }}
                        />
                    </GestureHandlerRootView>
                </SafeAreaProvider>
            </TicketsProvider>
        </KronodexProvider>
    );
}

