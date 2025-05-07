import { Stack } from "expo-router";

export default function ScanLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // Keep headers hidden for the scan flow
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen
                name="camera"
                options={{
                    presentation: "fullScreenModal",
                }}
            />
            <Stack.Screen
                name="results"
                options={{
                    animation: "slide_from_right",
                }}
            />
        </Stack>
    );
}

