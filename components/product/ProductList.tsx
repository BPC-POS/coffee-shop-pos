import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProductCard from './ProductCard';
import { Product, ProductStatus } from '@/types/Product';

interface ProductListProps {
  products: Product[];
  currentCategory: string;
  isLoading?: boolean;
  error?: string;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: number) => void;
}

type SortOption = 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'newest' | 'oldest';

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'name_asc', label: 'Tên A-Z' },
  { value: 'name_desc', label: 'Tên Z-A' },
];

const statusFilters = [
  { value: 'all', label: 'Tất cả trạng thái' },
  ...Object.values(ProductStatus).map(status => ({
    value: status,
    label: status === ProductStatus.ACTIVE ? 'Đang bán' :
           status === ProductStatus.INACTIVE ? 'Ngừng bán' :
           status === ProductStatus.SOLD_OUT ? 'Hết hàng' :
           status === ProductStatus.SEASONAL ? 'Theo mùa' :
           status === ProductStatus.NEW ? 'Mới' : 'Bán chạy'
  }))
];

const ITEMS_PER_PAGE = 12;

const ProductList: React.FC<ProductListProps> = ({
  products,
  currentCategory,
  isLoading,
  error,
  onEdit,
  onDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);


    const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
        return matchesCategory && matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name_asc':
            return a.name.localeCompare(b.name);
          case 'name_desc':
            return b.name.localeCompare(a.name);
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          default:
            return 0;
        }
      });
  }, [products, currentCategory, searchQuery, sortBy, statusFilter]);


  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);


  const paginatedProducts = useMemo(() => {
   const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = page * ITEMS_PER_PAGE;
      return filteredProducts.slice(startIndex, endIndex);
    }, [filteredProducts, page]);


   const handlePageChange = (newPage: number) => {
     setPage(newPage);
   };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.gridItem}>
         <View style={styles.productCard}>
            <ProductCard
                product={item}
                onEdit={() => onEdit?.(item)}
                onDelete={() => onDelete?.(item.id)}
            />
       </View>
     </View>
  );


   const renderPagination = () => {
        if (totalPages <= 1) {
            return null;
        }
        const renderPageNumbers = () => {
          const pageButtons = [];
          for (let i = 1; i <= totalPages; i++) {
            pageButtons.push(
               <TouchableOpacity
                   key={i}
                    style={[styles.pageButton, page === i && styles.activePageButton]}
                   onPress={() => handlePageChange(i)}
                >
                     <Text style={[styles.pageButtonText, page === i && styles.activePageButtonText]}>{i}</Text>
                </TouchableOpacity>
            )
          }
          return pageButtons
      }
        return (
            <View style={styles.paginationContainer}>
                {renderPageNumbers()}
           </View>
        )

    }

  if (error) {
      return (
          <View style={styles.alert}>
               <Text style={styles.alertText}>{error}</Text>
          </View>
      );
  }

  return (
        <View style={styles.container}>
            <View style={styles.filtersContainer}>
              <View style={styles.searchContainer}>
                 <Icon name="search" size={20} color="#888" style={styles.searchIcon}/>
                     <TextInput
                        style={styles.input}
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />
                </View>
                <View style={styles.selectContainer}>
                     <Text style={styles.selectLabel}>Trạng thái</Text>
                     <View style={styles.picker}>
                        <Picker
                            selectedValue={statusFilter}
                            style={styles.select}
                            onValueChange={(itemValue) => setStatusFilter(itemValue)}
                        >
                            {statusFilters.map(option => (
                                <Picker.Item key={option.value} label={option.label} value={option.value} />
                            ))}
                          </Picker>
                    </View>
                </View>
                 <View style={styles.selectContainer}>
                      <Text style={styles.selectLabel}>Sắp xếp</Text>
                    <View style={styles.picker}>
                         <Picker
                            selectedValue={sortBy}
                            style={styles.select}
                            onValueChange={(itemValue) => setSortBy(itemValue as SortOption)}
                        >
                            {sortOptions.map(option => (
                                <Picker.Item key={option.value} label={option.label} value={option.value} />
                            ))}
                           </Picker>
                    </View>
                 </View>
            </View>

            <View style={styles.resultSummary}>
               <Text style={styles.resultText}>
                    Hiển thị {paginatedProducts.length} trên tổng số {filteredProducts.length} sản phẩm
                </Text>
            </View>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007bff" />
             </View>
        ) : paginatedProducts.length === 0 ? (
                <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsTitle}>Không tìm thấy sản phẩm nào</Text>
                    <Text style={styles.noResultsSubtitle}>
                        Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                    </Text>
                </View>
        ) : (
                <FlatList
                   data={paginatedProducts}
                   renderItem={renderProduct}
                     keyExtractor={(item) => String(item.id)}
                    numColumns={4}
                  />
          )}
                {renderPagination()}
        </View>
  );
};


const styles = StyleSheet.create({
    container: {
      padding: 10
    },
    filtersContainer: {
         backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 10,
      flexDirection: 'row',
     flexWrap: 'wrap',
      gap: 10
    },
     searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        flex: 1
    },
      searchIcon: {
         marginHorizontal: 10
      },
     input: {
        flex: 1,
        padding: 10,
        fontFamily: 'Poppins',
    },
    selectContainer: {
      flex: 1
   },
    selectLabel: {
      fontFamily: 'Poppins',
         fontSize: 14
    },
  picker: {
       borderWidth: 1,
       borderColor: '#ccc',
      borderRadius: 5,
      backgroundColor: '#fff',

  },
   select: {
      fontFamily: 'Poppins',
       fontSize: 14
   },
    resultSummary: {
        paddingHorizontal: 10,
          marginBottom: 10,
    },
     resultText: {
         fontFamily: 'Poppins-Regular',
        fontSize: 13,
       color: 'gray'
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
         alignItems: 'center',
         height: 400,
    },
   noResultsContainer: {
      padding: 20,
        alignItems: 'center',
         backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
         shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3
    },
  noResultsTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
       color: '#555'
  },
    noResultsSubtitle: {
        fontFamily: 'Poppins-Regular',
          fontSize: 14,
        color: 'gray',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridItem: {
      width: '48%',
      padding: 5,
     maxWidth: '24%'
    },
     productCard: {
          transform: [{ translateY: 0 }]
     },
     paginationContainer: {
         flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        gap: 5
     },
       pageButton: {
         padding: 8,
           borderRadius: 5,
       },
    activePageButton: {
        backgroundColor: '#007bff',
    },
    pageButtonText: {
        fontFamily: 'Poppins-Medium',
        color: '#333'
    },
       activePageButtonText: {
         color: '#fff'
      },
     alert: {
       backgroundColor: '#f8d7da',
      padding: 10,
       borderRadius: 5,
    },
    alertText: {
       fontFamily: 'Poppins-Medium',
        color: '#721c24',
    }
});


export default ProductList;