import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import PosProductModal from './Modal/PosProductModal';
import { OrderItem } from '@/types/Order';
import { Product, ProductStatus } from '@/types/Product';
import RequireTableModal from './Modal/RequireTableModal';
import { getProducts } from '@/api/product';
import { formatCurrency } from '@/utils/format';

interface Props {
    selectedTable: string | null;
    orderItems: OrderItem[];
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onCheckout: () => void;
    onAddItem: (item: OrderItem) => void;
     onOpenRequireTableModal : () => void;
}

const categories = ['Tất cả', 'Cafe', 'Trà', 'Đá xay', 'Sữa chua', 'Khác'];

const PosProduct: React.FC<Props> = ({selectedTable, orderItems, onUpdateQuantity, onRemoveItem, onCheckout, onAddItem, onOpenRequireTableModal}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [requireTableModalVisible, setRequireTableModalVisible] = useState(false);

    const [products, setProducts] = useState<Product[]>([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState<string | null>(null); 

    useEffect(() => {
        fetchProductsData();
    }, []);

    const fetchProductsData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProducts();
            if (response.status >= 200 && response.status < 300) {
                setProducts(response.data);
            } else {
                setError(`Lỗi khi tải dữ liệu sản phẩm. Status code: ${response.status}`);
            }
        } catch (error: any) {
            setError("Lỗi kết nối hoặc lỗi không xác định khi tải dữ liệu sản phẩm.");
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };


    const filteredProducts = products.filter(product =>
        selectedCategory === 'Tất cả' || product.category === selectedCategory
    );

     const selectedProduct = products.find(product => product.id === selectedProductId) || null;

    const handleProductPress = (productId: number) => {
       if (!selectedTable) {
            setRequireTableModalVisible(true);
            return;
        }
        setSelectedProductId(productId);
        setIsCancelling(false);
        setModalVisible(true);
    };
   const handleCancelProduct = (productId: number) => {
        if (!selectedTable) {
            setRequireTableModalVisible(true);
            return;
        }
        setSelectedProductId(productId);
         setIsCancelling(true);
         setModalVisible(true);
   };

   const handleConfirm = () => {
    if (selectedProduct) {
      if (isCancelling) {
        onRemoveItem(selectedProduct.id);
        setSelectedProductId(null);
      } else {
           const newOrderItem: OrderItem = {
              id: Date.now(),
              productId: selectedProduct.id,
              productName: selectedProduct.name,
              price: Number(selectedProduct.price), 
              quantity: 1,
              note: '',
          };
        onAddItem(newOrderItem);
        console.log(newOrderItem);
        setSelectedProductId(null);
      }
    }
      setModalVisible(false);
  };

      const handleCloseRequireTableModal = () => {
           setRequireTableModalVisible(false);
      }

    const handleCancel = () => {
        setModalVisible(false);
    };
   const renderCategoryItem = ({ item }: { item: string }) => (
        <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === item && styles.selectedCategory]}
            onPress={() => setSelectedCategory(item)}
        >
            <Text style={styles.categoryText}>{item}</Text>
        </TouchableOpacity>
    );
  const renderProductItem = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={[styles.productButton, selectedProductId === item.id && styles.selectedProduct]}
             onLongPress={() => handleCancelProduct(item.id)}
            onPress={() => handleProductPress(item.id)}
        >
          <Image
              style={styles.productImage}
              source={{uri: item.meta.image_url}} 
          />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{formatCurrency(Number(item.price))}</Text>
            </View>

        </TouchableOpacity>
    );
    return (
      <View style={styles.container}>
          <View style={styles.categoryContainer}>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={item => item}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={styles.productListContainer}>
          {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : error ? (
                <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProductItem}
                    keyExtractor={item => String(item.id)}
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                />
            )}
          </View>
        <View style={styles.orderSummaryContainer}>
        </View>
           <RequireTableModal
              isVisible={requireTableModalVisible}
              onClose={handleCloseRequireTableModal}
            />
            <PosProductModal
                isVisible={modalVisible}
                productName={selectedProduct?.name ?? null}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                 isCancelling={isCancelling}
            />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
        flex: 1,
    },
    categoryContainer: {
        padding: 10,
    },
    categoryButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        marginRight: 10,
    },
    selectedCategory: {
        backgroundColor: '#007bff',
    },
    categoryText: {
        color: '#333',
    },
    productListContainer: {
        maxHeight: 500,
        padding: 10,
    },
    productButton: {
      flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        margin: 5,
        borderRadius: 5,
      maxWidth: '30%',
    },
    selectedProduct: {
        borderColor: '#28a745',
        borderWidth: 2,
    },
    productImage: {
        width: 100,
        height: 100,
      resizeMode: 'contain',
      marginBottom: 5,
    },
  productInfo: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
        color: '#333',
    textAlign: 'center',
  },
    productPrice: {
    fontSize: 14,
    color: '#555',
    },
   orderSummaryContainer: {
    },
});

export default PosProduct;