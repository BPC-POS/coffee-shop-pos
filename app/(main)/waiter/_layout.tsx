import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import Sidebar from '@/components/layouts/Sidebar'; 

const WaiterLayout = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Sidebar>
        <Stack
            screenOptions={{
              headerShown: false,
              headerTransparent: true,
              headerTintColor: 'white',
            }}
          />
      </Sidebar>
    </View>
  );
};

export default WaiterLayout;