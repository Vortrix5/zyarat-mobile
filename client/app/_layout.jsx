import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDebugMode } from '../utils/debug';

// Initialize debug helpers
initDebugMode();

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                    }}
                />
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

