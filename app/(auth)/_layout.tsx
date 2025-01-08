import React from 'react';
import { Stack } from 'expo-router';

const AuthLayout = () => {
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

export default AuthLayout;