import { Stack } from 'expo-router';
import React from 'react';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="index"
      // No header needed here, title comes from Drawer layout
      />
      <Stack.Screen
        name="achievements"
        options={{
          headerShown: true, // Show header specifically for this screen
          title: 'All Achievements',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
