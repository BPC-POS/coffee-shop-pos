import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Product, ProductVariant } from '@/types/Product';
import { formatCurrency } from '@/utils/format';

interface ProductVariantModalProps {
    isVisible: boolean;
    product: Product | null;
    onClose: () => void;
    onAddToCart: (variant: ProductVariant, product: Product) => void;
}

const ProductVariantModal: React.FC<ProductVariantModalProps> = ({ isVisible, product, onClose, onAddToCart }) => {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    useEffect(() => {
        if (!isVisible) {
            setSelectedVariant(null);
        }
        console.log("ProductVariantModal - useEffect: product prop =", product);
    }, [isVisible, product]);

    const handleVariantSelect = (variant: ProductVariant) => {
        setSelectedVariant(variant);
        console.log("ProductVariantModal - handleVariantSelect: selected variant =", variant);
    };

    const handleAddToCartPress = () => {
        console.log("ProductVariantModal - handleAddToCartPress: selectedVariant =", selectedVariant);
        console.log("ProductVariantModal - handleAddToCartPress: product =", product);
        if (selectedVariant && product) {
            console.log("ProductVariantModal - handleAddToCartPress: selectedVariant.price =", selectedVariant.price); // LOG unit_price
            onAddToCart(selectedVariant, product);
            onClose();
        } else {
            Alert.alert("Lỗi", "Vui lòng chọn một biến thể sản phẩm.");
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>X</Text>
                    </TouchableOpacity>

                    {product ? (
                        <ScrollView>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productDescription}>{product.description}</Text>

                            <Text style={styles.variantsTitle}>Chọn Size:</Text>
                            {product.variants.length > 0 ? (
                                product.variants.map(variant => (
                                    <TouchableOpacity
                                        key={variant.id}
                                        style={[
                                            styles.variantButton,
                                            selectedVariant?.id === variant.id && styles.selectedVariantButton
                                        ]}
                                        onPress={() => handleVariantSelect(variant)} // Truyền trực tiếp variant
                                    >
                                        <Text style={styles.variantSku}>{variant.sku}</Text>
                                        <Text style={styles.variantPrice}>{formatCurrency(Number(variant.price))}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text>Sản phẩm này không có biến thể.</Text>
                            )}

                            <TouchableOpacity
                                style={styles.addToCartButton}
                                onPress={handleAddToCartPress}
                                disabled={!selectedVariant}
                            >
                                <Text style={styles.addToCartButtonText}>Thêm vào Order</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    ) : (
                        <Text style={styles.errorText}>Lỗi khi tải chi tiết sản phẩm.</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
        maxHeight: '90%',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    productName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    productDescription: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    variantsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    variantButton: {
        padding: 15,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    selectedVariantButton: {
        backgroundColor: '#c8e6c9',
    },
    variantSku: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    variantPrice: {
        fontSize: 16,
        color: '#555',
    },
    addToCartButton: {
        backgroundColor: '#007bff',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginTop: 20,
        alignSelf: 'center',
    },
    addToCartButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ProductVariantModal;