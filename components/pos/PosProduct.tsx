import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { OrderItemAPI } from '@/types/Order';
import { Product, Category, ProductVariant } from '@/types/Product';
import RequireTableModal from './Modal/RequireTableModal';
import { getProducts, getProductById } from '@/api/product';
import { getCategories } from '@/api/category';
import { formatCurrency } from '@/utils/format';
import ProductVariantModal from './Modal/ProductVariantModal';

interface Props {
    selectedTable: string | null;
    orderItems: OrderItemAPI[];
    onUpdateQuantity: (productId: number, newQuantity: number) => void;
    onRemoveItem: (productId: number) => void;
    onCheckout: () => void;
    onAddItem: (item: OrderItemAPI) => void;
    onOpenRequireTableModal: () => void;
}

const PosProduct: React.FC<Props> = ({ selectedTable, orderItems, onUpdateQuantity, onRemoveItem, onCheckout, onAddItem, onOpenRequireTableModal }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
    const [requireTableModalVisible, setRequireTableModalVisible] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [apiCategories, setApiCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errorCategories, setErrorCategories] = useState<string | null>(null);
    const [isVariantModalVisible, setIsVariantModalVisible] = useState(false);
    const [selectedProductForVariant, setSelectedProductForVariant] = useState<Product | null>(null);

    useEffect(() => {
        fetchProductsData();
        fetchCategoriesData();
    }, []);

    const fetchCategoriesData = async () => {
        setLoadingCategories(true);
        setErrorCategories(null);
        try {
            const response = await getCategories();
            if (response.status >= 200 && response.status < 300) {
                setApiCategories([{ id: 'Tất cả', name: 'Tất cả', isActive: true }, ...response.data]);
                setSelectedCategory('Tất cả');
            } else {
                setErrorCategories(`Lỗi khi tải dữ liệu danh mục. Status code: ${response.status}`);
            }
        } catch (error: any) {
            setErrorCategories("Lỗi kết nối hoặc lỗi không xác định khi tải dữ liệu danh mục.");
            console.error("Error fetching categories:", error);
        } finally {
            setLoadingCategories(false);
        }
    };

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

    const filteredProducts = products.filter(product => {
        if (!selectedCategory || selectedCategory === 'Tất cả') {
            return true;
        }
        const categoryIds = product.categories.map(cat => cat.toString());
        return apiCategories.some(cat => categoryIds.includes(cat.id.toString()) && cat.name === selectedCategory);
    });

    const handleProductPress = async (productId: number) => {
        if (!selectedTable) {
            setRequireTableModalVisible(true);
            return;
        }
        console.log("PosProduct - handleProductPress: productId =", productId);
        try {
            const response = await getProductById(productId);
            if (response.status >= 200 && response.status < 300) {
                const productDetail = response.data;
                console.log("PosProduct - handleProductPress: productDetail =", productDetail);
                setSelectedProductForVariant(productDetail);
                setIsVariantModalVisible(true);
            } else {
                setError(`Lỗi khi tải chi tiết sản phẩm. Status code: ${response.status}`);
            }
        } catch (error: any) {
            setError("Lỗi kết nối hoặc lỗi không xác định khi tải chi tiết sản phẩm.");
            console.error("Error fetching product detail:", error);
        } finally {
        }
    };

    const handleCloseRequireTableModal = () => {
        setRequireTableModalVisible(false);
    }

    const handleCloseVariantModal = () => {
        setIsVariantModalVisible(false);
        setSelectedProductForVariant(null);
    };

    const renderCategoryItem = ({ item }: { item: Category }) => {
        const isSelected = selectedCategory === item.name;
        return (
            <TouchableOpacity
                style={[styles.categoryButton, isSelected && styles.selectedCategory]}
                onPress={() => setSelectedCategory(item.name)}
            >
                <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>{item.name}</Text>
            </TouchableOpacity>
        );
    };

    const renderProductItem = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={[styles.productButton]}
            onPress={() => handleProductPress(item.id)}
        >
            <Image
                style={styles.productImage}
                source={{ uri: item.meta.image_url }}
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{formatCurrency(Number(item.price))}</Text>
            </View>
        </TouchableOpacity>
    );

    const handleAddToCartVariant = (variant: ProductVariant, product: Product) => {
        console.log("PosProduct - handleAddToCartVariant: variant received from Modal =", variant); // Log variant nhận từ Modal
        console.log("PosProduct - handleAddToCartVariant: product received from Modal =", product); // Log product nhận từ Modal

        const newOrderItem: OrderItemAPI = {
            id: Date.now(),
            product_id: product.id,
            product_name: product.name + ' - ' + variant.sku,
            unit_price: Number(variant.price),
            quantity: 1,
            variant_id: variant.id,
        };
        console.log("PosProduct - handleAddToCartVariant: newOrderItem created =", newOrderItem); // Log newOrderItem trước khi gọi onAddItem

        onAddItem(newOrderItem);
        console.log("PosProduct - handleAddToCartVariant: onAddItem called with item =", newOrderItem); // Log sau khi gọi onAddItem
    };


    return (
        <View style={styles.container}>
            <View style={styles.categoryContainer}>
                {loadingCategories ? (
                    <ActivityIndicator size="small" color="#007bff" />
                ) : errorCategories ? (
                    <Text style={{ color: 'red', textAlign: 'center' }}>{errorCategories}</Text>
                ) : (
                    <FlatList
                        data={apiCategories}
                        renderItem={renderCategoryItem}
                        keyExtractor={item => String(item.id)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    />
                )}
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
            <ProductVariantModal
                isVisible={isVariantModalVisible}
                product={selectedProductForVariant}
                onClose={handleCloseVariantModal}
                onAddToCart={handleAddToCartVariant}
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
    selectedCategoryText: {
        color: '#fff',
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