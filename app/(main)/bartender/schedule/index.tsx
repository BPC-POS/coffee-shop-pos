import React from 'react';
import { View, StyleSheet } from 'react-native';
import StaffSchedule from '@/components/staff/StaffSchedule';

const BartenderScheduleScreen = () => {
  return (
    <View style={styles.container}>
      <StaffSchedule staff={[]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default BartenderScheduleScreen; 