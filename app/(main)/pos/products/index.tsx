import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { getProducts } from '@/api/product';
import { Product, ProductStatus } from '@/types/Product';

const mapAPIProductToProduct = (apiProduct: any): Product => {
  // Map dữ liệu API về dạng Product
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    price: Number(apiProduct.price) || 0,
    description: apiProduct.description || '',
    image: apiProduct.meta?.image_url || 'https://via.placeholder.com/150',
    status: Number(apiProduct.status) || ProductStatus.ACTIVE,
    sku: apiProduct.sku || '',
    stock_quantity: Number(apiProduct.stock_quantity) || 0,
    isAvailable: Number(apiProduct.stock_quantity) > 0,
    createdAt: new Date(apiProduct.createdAt || Date.now()),
    updatedAt: new Date(apiProduct.updatedAt || Date.now()),
    meta: apiProduct.meta || {},
    categories: apiProduct.categories || [],
    attributes: apiProduct.attributes || [],
    variants: apiProduct.variants || [],
    category: '',
    size: [{ name: 'Mặc định', price: Number(apiProduct.price) || 0, isDefault: true }]
  };
};

const ProductsScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      const mappedProducts = response.data.map(mapAPIProductToProduct);
      setProducts(mappedProducts);
      console.log(`Đã tải ${mappedProducts.length} sản phẩm từ API`);
    } catch (error) {
      console.error("Lỗi khi tải danh sách sản phẩm:", error);
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#f4511e" />
        <Text style={styles.loadingText}>Đang tải danh sách sản phẩm...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

      {/* Hiển thị danh sách sản phẩm */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productItem} onPress={() => Alert.alert(`Thông tin sản phẩm`, `${item.name}\nGiá: ${item.price} VND\n${item.description}`)}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.productImage} 
              defaultSource={require('@/assets/images/icon.png')}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN')} VND</Text>
              <Text style={[styles.productStatus, { color: item.isAvailable ? 'green' : 'red' }]}>
                {item.isAvailable ? 'Còn hàng' : 'Hết hàng'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
  retryButton: {
    backgroundColor: '#f4511e',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
  },
  productStatus: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default ProductsScreen;
