import { Stack } from "expo-router"

export default function Layout() {
    // Keep headers hidden for the auth flow
    return <Stack screenOptions={{ headerShown: false }} />
}

