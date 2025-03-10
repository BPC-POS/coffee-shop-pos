import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { View } from 'react-native';
import WaiterSidebar from '@/components/layouts/WaiterSidebar'; 

const WaiterLayout = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <WaiterSidebar>
        <Stack
            screenOptions={{
              headerShown: false,
              headerTransparent: true,
              headerTintColor: 'white',
            }}
          />
      </WaiterSidebar>
    </View>
  );
};

export default WaiterLayout;