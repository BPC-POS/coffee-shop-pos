import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Product, ProductStatus } from '@/types/Product';
import { formatCurrency } from '@/utils/format';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
}

const statusColors = {
  [ProductStatus.ACTIVE]: '#28a745',
  [ProductStatus.INACTIVE]: '#dc3545',
  [ProductStatus.SOLD_OUT]: '#ffc107',
  [ProductStatus.SEASONAL]: '#17a2b8',
  [ProductStatus.NEW]: '#007bff',
  [ProductStatus.BEST_SELLER]: '#6c757d'
} as const;

const statusLabels = {
  [ProductStatus.ACTIVE]: 'Đang bán',
  [ProductStatus.INACTIVE]: 'Ngừng bán',
  [ProductStatus.SOLD_OUT]: 'Hết hàng',
  [ProductStatus.SEASONAL]: 'Theo mùa',
  [ProductStatus.NEW]: 'Mới',
  [ProductStatus.BEST_SELLER]: 'Bán chạy'
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete }) => {
  const defaultSize = product.size.find(s => s.isDefault);
  const basePrice = defaultSize ? defaultSize.price : product.price;

  return (
     <View style={styles.card}>
        <View style={styles.imageContainer}>
         <Image
            style={styles.image}
            source={{uri: product.image}}
          />
          <View style={styles.chipContainer}>
                <View style={[styles.chip, { backgroundColor: statusColors[product.status]}]}>
                    <Text style={styles.chipText}>{statusLabels[product.status]}</Text>
                </View>
            </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.contentContainer}>
                <View style={styles.titleContainer}>
                   <View style={{ flex: 1 }}>
                         <Text style={styles.productName}>{product.name}</Text>
                        <View style={styles.availability}>
                            <View style={[styles.statusDot, { backgroundColor: product.isAvailable ? '#28a745' : '#dc3545' }]}/>
                           <Text style={styles.availabilityText}>
                               {product.isAvailable ? 'Còn hàng' : 'Hết hàng'}
                            </Text>
                        </View>
                    </View>
                     <View style={styles.actions}>
                       <TouchableOpacity style={styles.actionButton} onPress={() => onEdit?.(product)}>
                             <Icon name="edit" size={24} color="#007bff"/>
                         </TouchableOpacity>
                         <TouchableOpacity style={styles.actionButton} onPress={() => onDelete?.(product.id)}>
                               <Icon name="delete" size={24} color="red" />
                           </TouchableOpacity>
                     </View>
                </View>
                  <View style={styles.sizeContainer}>
                      {product.size.map((size) => (
                          <View key={size.name} style={[styles.sizeChip, size.isDefault && styles.sizeChipDefault]}>
                            <Text style={styles.sizeText}>{`${size.name}: ${formatCurrency(size.price)}`}</Text>
                          </View>
                      ))}
                </View>
                {product.toppings && product.toppings.length > 0 && (
                <Text style={styles.toppingText}>
                    Topping: {product.toppings.map(t => t.name).join(', ')}
                </Text>
                )}
                <Text style={styles.description} >{product.description}</Text>

             <View style={styles.priceContainer}>
                    <Text style={styles.basePrice}>
                        {formatCurrency(basePrice)}
                    </Text>
                    {product.originalPrice && (
                        <Text style={styles.originalPrice}>
                            {formatCurrency(product.originalPrice)}
                        </Text>
                    )}
             </View>
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
        backgroundColor: '#fff',
          borderRadius: 10,
          overflow: 'hidden',
        shadowColor: '#000',
         shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
          shadowRadius: 4,
           elevation: 3,
      transform: [{ translateY: 0 }]
  },
      imageContainer: {
      width: '100%',
      aspectRatio: 1,
      position: 'relative'
     },
    image: {
         width: '100%',
        height: '100%',
          resizeMode: 'cover',

    },
    chipContainer: {
       position: 'absolute',
      top: 10,
      right: 10,
  },
  chip: {
      paddingVertical: 5,
      paddingHorizontal: 8,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 1,
    },
  chipText: {
    color: '#fff',
        fontFamily: 'Poppins-Medium'
    },
    cardContent: {
     padding: 10,
    },
    contentContainer: {
      gap: 5
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
         justifyContent: 'space-between',
    },
    productName: {
      fontFamily: 'Poppins-Bold',
         fontSize: 16,
        flex: 1,
    },
      availability: {
        flexDirection: 'row',
        alignItems: 'center',
         marginTop: 5
   },
   statusDot: {
      width: 8,
        height: 8,
      borderRadius: 4,
      marginRight: 5,
    },
      availabilityText: {
       fontFamily: 'Poppins-Regular',
         fontSize: 12,
        color: 'gray'
     },
     actions: {
       flexDirection: 'row',
        alignItems: 'center',
       gap: 5
    },
    actionButton: {
        padding: 5,
      backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 5
    },
     sizeContainer: {
         flexDirection: 'row',
         flexWrap: 'wrap',
         gap: 5,
         marginTop: 5
     },
      sizeChip: {
          padding: 5,
        borderRadius: 5,
          borderWidth: 1,
        borderColor: '#ccc',

    },
     sizeChipDefault: {
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderColor: '#007bff',
     },
       sizeText: {
            fontFamily: 'Poppins-Medium',
            fontSize: 12
      },
    toppingText: {
       fontFamily: 'Poppins-Regular',
       fontSize: 13,
         color: 'gray'
  },
    description: {
         fontFamily: 'Poppins-Regular',
        fontSize: 14,
      color: 'gray',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
         paddingTop: 5,
         borderTopWidth: 1,
        borderTopColor: '#eee'
     },
    basePrice: {
       fontFamily: 'Poppins-Bold',
        color: '#007bff',
        fontSize: 18
    },
     originalPrice: {
       fontFamily: 'Poppins-Regular',
         fontSize: 13,
        color: 'gray',
        textDecorationLine: 'line-through',
    },
});

export default ProductCard;