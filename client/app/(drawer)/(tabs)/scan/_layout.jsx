import { Stack } from "expo-router";
import { View } from "react-native";

export default function ScanLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        flex: 1,
                    },
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
        </View>
    );
}

