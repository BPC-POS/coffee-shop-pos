import React from 'react';
import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,  // Ẩn header chung
      }}
    >
      <Stack.Screen
        name="bartender"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="pos"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="waiter"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}