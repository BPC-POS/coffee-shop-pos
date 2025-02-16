import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import AreaTableScreen from './Tables/index'; // Đảm bảo đúng đường dẫn tới AreaTableScreen

const WaiterScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Phục vụ',
          headerStyle: {
            backgroundColor: '#007bff', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }}
      />
      <AreaTableScreen />
    </View>
  );
};

export default WaiterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
