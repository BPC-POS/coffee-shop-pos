import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Product } from '@/types/Product';
import ProductList from '@/components/product/ProductList';
import { mockProducts } from '@/mock/mockProducts';

const ProductsScreen = () => {
  const handleEdit = (product: Product) => {
  };
  const handleDelete = (product: Product) => {
  };

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
         {/* <ProductList
           products={mockProducts}
           currentCategory={'all'}
           onEdit={handleEdit}
           onDelete={handleDelete}
        /> */}
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