import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { getProductById } from '@/api/product';

interface Props {
    visible: boolean;
    productId: number | null;
    onClose: () => void;
}

interface Recipe {
    ingredients: string[];
    instructions: string[];
}

const BartenderRecipeModal = ({ visible, productId, onClose }: Props) => {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [productName, setProductName] = useState<string>('');

    useEffect(() => {
        if (visible && productId) {
            fetchRecipe(productId);
        } else {
            // Reset state when modal is closed
            setRecipe(null);
            setError(null);
        }
    }, [visible, productId]);

    const fetchRecipe = async (pid: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProductById(pid);
            const product = response.data;
            
            if (product && product.meta && product.meta.recipes) {
                const recipeData = product.meta.recipes;
                
                // Format ingredients and instructions as arrays
                const ingredientsArray = recipeData.ingredients ? recipeData.ingredients.split('\n').filter((item: string) => item.trim() !== '') : [];
                const instructionsArray = recipeData.instructions ? recipeData.instructions.split('\n').filter((item: string) => item.trim() !== '') : [];
                
                setRecipe({
                    ingredients: ingredientsArray,
                    instructions: instructionsArray
                });
                setProductName(product.name || `Sản phẩm #${pid}`);
            } else {
                setError('Không tìm thấy công thức cho sản phẩm này');
            }
        } catch (err) {
            console.error('Error fetching recipe:', err);
            setError('Không thể tải công thức. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Công thức pha chế</Text>
                    
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#8b4513" />
                            <Text style={styles.loadingText}>Đang tải công thức...</Text>
                        </View>
                    ) : error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : recipe ? (
                        <ScrollView style={styles.recipeContainer}>
                            <Text style={styles.productName}>{productName}</Text>
                            
                            <Text style={styles.sectionTitle}>Nguyên liệu:</Text>
                            {recipe.ingredients.length > 0 ? (
                                recipe.ingredients.map((ingredient, index) => (
                                    <Text key={index} style={styles.listItem}>• {ingredient}</Text>
                                ))
                            ) : (
                                <Text style={styles.noDataText}>Không có thông tin nguyên liệu</Text>
                            )}
                            
                            <Text style={styles.sectionTitle}>Các bước thực hiện:</Text>
                            {recipe.instructions.length > 0 ? (
                                recipe.instructions.map((step, index) => (
                                    <Text key={index} style={styles.listItem}>
                                        {index + 1}. {step}
                                    </Text>
                                ))
                            ) : (
                                <Text style={styles.noDataText}>Không có hướng dẫn thực hiện</Text>
                            )}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noRecipe}>Không tìm thấy công thức</Text>
                    )}
                    
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '80%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    recipeContainer: {
        maxHeight: '80%',
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#8b4513',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 5,
    },
    listItem: {
        fontSize: 14,
        marginBottom: 5,
        paddingLeft: 10,
    },
    noRecipe: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginVertical: 20,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#8b4513',
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#dc3545',
        marginVertical: 20,
    },
    noDataText: {
        fontStyle: 'italic',
        color: '#666',
        paddingLeft: 10,
    }
});

export default BartenderRecipeModal; 
