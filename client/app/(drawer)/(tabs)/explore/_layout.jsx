import { Stack } from 'expo-router';
import React from 'react';

export default function ExploreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Explore' }} />
      {/* Add the details screen to the stack */}
      <Stack.Screen
        name="details/[id]" // Match the file structure
        options={{
          title: 'Details', // You can customize this title
          // presentation: 'modal', // Optional: if you want it to slide up
        }}
      />
    </Stack>
  );
}
