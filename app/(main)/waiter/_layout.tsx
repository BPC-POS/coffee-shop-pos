import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';

const WaiterLayout = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            headerTransparent: true,
            headerTintColor: 'white',
          }}
        />
    </View>
  );
};

export default WaiterLayout;