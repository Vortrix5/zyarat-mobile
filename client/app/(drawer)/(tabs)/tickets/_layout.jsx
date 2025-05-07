import { Stack } from 'expo-router';
import React from 'react';

export default function TicketsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The index screen (tickets/index.tsx) will be automatically included */}
      <Stack.Screen name="index" />
    </Stack>
  );
}
