import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import PosProductModal from './PosProductModal';


interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string; // Thêm thuộc tính category
}
interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
}
interface Props {
    selectedTable: string | null;
    orderItems: OrderItem[];
    onUpdateQuantity: (productId: string, newQuantity: number) => void;
    onRemoveItem: (productId: string) => void;
    onCheckout: () => void;
    onAddItem: (item : OrderItem) => void;
}

// Dữ liệu sản phẩm mẫu
const products: Product[] = [
    {
        id: '1',
        name: 'Cafe Đen',
        price: 25000,
        imageUrl: 'https://product.hstatic.net/200000543909/product/1691482381_caphe_den_da_1_56c83f40a6914615a4c37af8504e00d4_master.png',
        category: 'Cafe',
    },
    {
        id: '2',
        name: 'Cafe Sữa',
        price: 30000,
        imageUrl: 'https://product.hstatic.net/200000543909/product/1691482505_caphe_sua_da_1_6e3d62c44590445c995e892a0f2c24d5_master.png',
        category: 'Cafe',
    },
    {
        id: '3',
        name: 'Bạc Xỉu',
        price: 32000,
        imageUrl: 'https://product.hstatic.net/200000543909/product/1691482577_bacxiu_1_232c4552292241d293d589a024e0d209_master.png',
        category: 'Cafe',
    },
    {
        id: '4',
        name: 'Trà đào',
        price: 40000,
        imageUrl: 'https://product.hstatic.net/200000543909/product/1691482472_trasuadao_1_64873ff999184421b24b992e7c50c627_master.png',
        category: 'Trà',
    },
    {
        id: '5',
        name: 'Trà tắc',
        price: 25000,
        imageUrl: 'https://product.hstatic.net/200000543909/product/1691482544_tratac_1_0165d4439f3b4248bc875173c119a554_master.png',
        category: 'Trà',
    },
    {
        id: '6',
        name: 'Nước ngọt',
        price: 20000,
        imageUrl: 'https://product.hstatic.net/200000543909/product/1691482714_nuocngot_1_b23263805f174243a1c327654766e423_master.png',
        category: 'Khác',
    },
     {
        id: '7',
        name: 'Đá Xay Chocolate',
        price: 50000,
       imageUrl: 'https://product.hstatic.net/200000543909/product/1691482651_daxaychocolate_1_07245b6a9c744376bc92814b6f769a3d_master.png',
        category: 'Đá xay',
    },
    {
        id: '8',
         name: 'Sữa Chua Việt Quất',
        price: 45000,
        imageUrl: 'https://product.hstatic.net/200000543909/product/1691482624_suachua_1_3f902d49268e4710b043a5b015b9239c_master.png',
         category: 'Sữa chua',
    },
];

// Dữ liệu category mẫu
const categories = ['Tất cả', 'Cafe', 'Trà', 'Đá xay', 'Sữa chua', 'Khác'];

const PosProduct: React.FC<Props> = ({selectedTable, orderItems, onUpdateQuantity, onRemoveItem, onCheckout, onAddItem}) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);


    const filteredProducts = products.filter(product =>
        selectedCategory === 'Tất cả' || product.category === selectedCategory
    );

     const selectedProduct = products.find(product => product.id === selectedProductId) || null;

     const handleProductPress = (productId: string) => {
      setSelectedProductId(productId);
         setIsCancelling(false);
      setModalVisible(true);
    };

    const handleCancelProduct = (productId: string) => {
      setSelectedProductId(productId);
        setIsCancelling(true);
      setModalVisible(true);
    };

   const handleConfirm = () => {
        if (selectedProduct) {
           if(isCancelling) {
                onRemoveItem(selectedProduct.id)
               setSelectedProductId(null);

           } else {
                const newOrderItem: OrderItem = {
                     productId: selectedProduct.id,
                     name: selectedProduct.name,
                     price: selectedProduct.price,
                     quantity: 1,
                     imageUrl: selectedProduct.imageUrl
                 };
                 onAddItem(newOrderItem)
                setSelectedProductId(null);
            }
        }
        setModalVisible(false);
    };

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
              source={{uri: item.imageUrl}}
          />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Text>
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
          <FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={item => item.id}
            numColumns={4}
            showsVerticalScrollIndicator={false}
          />
          </View>
        <View style={styles.orderSummaryContainer}>
        </View>

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
        maxHeight: 200,
        padding: 10,
    },
    productButton: {
      flex: 1, // Chiếm đều không gian trong hàng
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        padding: 10,
        margin: 5,
        borderRadius: 5,
      maxWidth: '24%', // Đảm bảo kích thước tối đa của cột (1/3 màn hình)
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
    textAlign: 'center', // Căn giữa văn bản
  },
    productPrice: {
    fontSize: 14,
    color: '#555',
    },
   orderSummaryContainer: {
        // flex: 1,
    },
});

export default PosProduct;