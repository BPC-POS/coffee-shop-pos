import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { mockRecipes } from '@/mock/mockRecipes';

interface Props {
    visible: boolean;
    productId: number | null;
    onClose: () => void;
}

const BartenderRecipeModal = ({ visible, productId, onClose }: Props) => {
    const recipe = mockRecipes.find(r => r.productId === productId);

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.title}>Công thức pha chế</Text>
                    
                    {recipe ? (
                        <ScrollView style={styles.recipeContainer}>
                            <Text style={styles.productName}>{recipe.productName}</Text>
                            
                            <Text style={styles.sectionTitle}>Nguyên liệu:</Text>
                            {recipe.ingredients.map((ingredient, index) => (
                                <Text key={index} style={styles.listItem}>• {ingredient}</Text>
                            ))}
                            
                            <Text style={styles.sectionTitle}>Các bước thực hiện:</Text>
                            {recipe.steps.map((step, index) => (
                                <Text key={index} style={styles.listItem}>
                                    {index + 1}. {step}
                                </Text>
                            ))}
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
});

export default BartenderRecipeModal; 
