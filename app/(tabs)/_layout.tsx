import React from 'react';
import { Stack } from 'expo-router';

const TabsLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        headerTintColor: 'white',
      }}
    />
  );
};

export default TabsLayout;