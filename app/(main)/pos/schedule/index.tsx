import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import StaffSchedule from '@/components/staff/StaffSchedule'; // Adjust path if needed
import { getEmployees } from '@/api/employee'; // Adjust path if needed
import { Staff } from '@/types/Staff'; // Adjust path if needed

const ScheduleScreen = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getEmployees();
        if (response && response.data) {
          setStaff(response.data);
        } else {
          console.warn("Received invalid data structure from getEmployees:", response);
          setError("Không thể tải danh sách nhân viên (dữ liệu không hợp lệ).");
          setStaff([]);
        }
      } catch (err: any) {
        console.error("Failed to fetch employees:", err);
        setError(`Lỗi tải nhân viên: ${err.message || 'Lỗi không xác định'}`);
        setStaff([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Stack.Screen />
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={styles.loadingText}>Đang tải dữ liệu nhân viên...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
         <Stack.Screen />
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
       <Stack.Screen />
      <View style={styles.content}>
        <StaffSchedule staff={staff} />
      </View>
    </SafeAreaView>
  );
};

const screenOptions = {
  title: 'Lịch làm việc',
  headerStyle: {
    backgroundColor: '#28a745',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: "bold",
  },
  headerTitleAlign: 'center' as const,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  content: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
     backgroundColor: '#fff',
  },
  loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: '#555',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default ScheduleScreen;