import React from 'react';
import { Stack, useRouter } from 'expo-router';
import Header from '@/components/layouts/Header';
import { View } from 'react-native';
import Sidebar from '@/components/layouts/Sidebar'; 

const MainLayout = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {/* <Header title="Coffee Shop" /> */}
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

export default MainLayout;