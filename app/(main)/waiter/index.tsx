import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import AreaTableScreen from './Tables/index';
import { Ionicons } from '@expo/vector-icons';
import WaiterNotificationModal from '@/components/waiter/Modal/WaiterNotifyModal';
import { mockOrders } from '@/mock/mockdata';  // Import mock data

const WaiterScreen = () => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Phục vụ',
          headerStyle: { backgroundColor: '#007bff' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity onPress={() => setIsNotificationVisible(true)}>
              <Ionicons name="notifications-outline" size={24} color="white" style={{ marginRight: 10 }} />
            </TouchableOpacity>
          ),
        }}
      />
      <AreaTableScreen />

      {/* Hiển thị modal khi có thông báo */}
      <WaiterNotificationModal
        isVisible={isNotificationVisible}
        onClose={() => setIsNotificationVisible(false)}
        notifications={mockOrders}  // Truyền mock data vào modal
      />
    </View>
  );
};

export default WaiterScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
