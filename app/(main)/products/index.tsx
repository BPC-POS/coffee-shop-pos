import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

const ProductsScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Danh sách sản phẩm',
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Trang quản lý sản phẩm</Text>
        {/* Nội dung của trang quản lý sản phẩm */}
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

export default ProductsScreen;