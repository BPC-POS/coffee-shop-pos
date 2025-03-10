import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import StaffSchedule from '@/components/staff/StaffSchedule';
import { mockStaff } from '@/mock/mockStaff';

const ScheduleScreen = () => {
  return (
    <View style={styles.container}>
       <Stack.Screen
        options={{
          title: 'Lịch làm việc',
          headerStyle: {
            backgroundColor: '#28a745',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View style={styles.content}>
      <StaffSchedule staff={mockStaff} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ScheduleScreen;