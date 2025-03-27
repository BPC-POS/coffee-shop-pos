import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Order, OrderStatus, PaymentStatus } from '@/types/Order';
import { formatCurrency } from '@/utils/format';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { FlatList } from 'react-native';

interface OrderListProps {
  orders: Order[];
  onViewDetail: (order: Order) => void;
  onStatusChange: (orderId: number, status: OrderStatus) => void;
  onPaymentStatusChange: (orderId: number, status: PaymentStatus) => void;
}

const statusColors = {
    [OrderStatus.PENDING]: '#ffc107',
    [OrderStatus.CONFIRMED]: '#17a2b8',
    [OrderStatus.PREPARING]: '#007bff',
    [OrderStatus.READY]: '#6c757d',
    [OrderStatus.COMPLETED]: '#28a745',
    [OrderStatus.CANCELLED]: '#dc3545',
} as const;

const statusLabels = {
    [OrderStatus.PENDING]: 'Chờ xác nhận',
    [OrderStatus.CONFIRMED]: 'Đã xác nhận',
    [OrderStatus.PREPARING]: 'Đang pha chế',
    [OrderStatus.READY]: 'Sẵn sàng phục vụ',
    [OrderStatus.COMPLETED]: 'Hoàn thành',
    [OrderStatus.CANCELLED]: 'Đã hủy',
};

const paymentStatusColors = {
    [PaymentStatus.UNPAID]: '#dc3545',
    [PaymentStatus.PARTIALLY_PAID]: '#ffc107',
    [PaymentStatus.PAID]: '#28a745',
    [PaymentStatus.REFUNDED]: '#17a2b8',
} as const;

const paymentStatusLabels = {
    [PaymentStatus.UNPAID]: 'Chưa thanh toán',
    [PaymentStatus.PARTIALLY_PAID]: 'Thanh toán một phần',
    [PaymentStatus.PAID]: 'Đã thanh toán',
    [PaymentStatus.REFUNDED]: 'Đã hoàn tiền',
};

const ITEMS_PER_PAGE = 5;
const screenWidth = Dimensions.get('window').width;

const OrderList: React.FC<OrderListProps> = ({
  orders,
  onViewDetail,
  onStatusChange,
  onPaymentStatusChange,
}) => {
    const [page, setPage] = useState(1);

    const paginatedOrders = React.useMemo(() => {
     const startIndex = (page - 1) * ITEMS_PER_PAGE;
     const endIndex = page * ITEMS_PER_PAGE;
      return orders.slice(startIndex, endIndex);
    }, [orders, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => onViewDetail(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>#{item.orderNumber}</Text>
          <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
        <TouchableOpacity style={styles.viewButton} onPress={() => onViewDetail(item)}>
          <Icon name="visibility" size={20} color="#007bff" />
          <Text style={styles.viewButtonText}>Chi tiết</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.customerSection}>
          <Text style={styles.sectionLabel}>Khách hàng</Text>
          <Text style={styles.sectionValue}>{item.customerName}</Text>
          {item.customerPhone && (
            <Text style={styles.sectionSubvalue}>{item.customerPhone}</Text>
          )}
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.sectionLabel}>Bàn</Text>
            <Text style={styles.tableValue}>{item.tableId || '-'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.sectionLabel}>Trạng thái</Text>
            <View style={[styles.chip, {backgroundColor: statusColors[item.status]}]}>
              <Text style={styles.chipText}>{statusLabels[item.status]}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.sectionLabel}>Thanh toán</Text>
            <View style={[styles.chip, {backgroundColor: paymentStatusColors[item.paymentStatus]}]}>
              <Text style={styles.chipText}>{paymentStatusLabels[item.paymentStatus]}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Tổng tiền:</Text>
        <Text style={styles.totalAmount}>{formatCurrency(item.totalAmount)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);

    if (totalPages <= 1) {
      return null;
    }

    const renderPageNumbers = () => {
      const pageButtons = [];
      
      // Previous button
      pageButtons.push(
        <TouchableOpacity
          key="prev"
          style={[styles.navButton, page === 1 && styles.disabledNavButton]}
          onPress={() => page > 1 && handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <Icon name="chevron-left" size={18} color={page === 1 ? "#ccc" : "#007bff"} />
        </TouchableOpacity>
      );

      // First page
      if (page > 2) {
        pageButtons.push(
          <TouchableOpacity
            key={1}
            style={[styles.pageButton, page === 1 && styles.activePageButton]}
            onPress={() => handlePageChange(1)}
          >
            <Text style={[styles.pageButtonText, page === 1 && styles.activePageButtonText]}>1</Text>
          </TouchableOpacity>
        );
      }

      // Ellipsis if needed
      if (page > 3) {
        pageButtons.push(
          <Text key="ellipsis1" style={styles.ellipsis}>...</Text>
        );
      }

      // Current page and adjacent pages
      for (let i = Math.max(1, page - 1); i <= Math.min(totalPages, page + 1); i++) {
        if (i !== 1 && i !== totalPages) { // Skip first and last pages as they're handled separately
          pageButtons.push(
            <TouchableOpacity
              key={i}
              style={[styles.pageButton, page === i && styles.activePageButton]}
              onPress={() => handlePageChange(i)}
            >
              <Text style={[styles.pageButtonText, page === i && styles.activePageButtonText]}>{i}</Text>
            </TouchableOpacity>
          );
        }
      }

      // Ellipsis if needed
      if (page < totalPages - 2) {
        pageButtons.push(
          <Text key="ellipsis2" style={styles.ellipsis}>...</Text>
        );
      }

      // Last page
      if (page < totalPages - 1) {
        pageButtons.push(
          <TouchableOpacity
            key={totalPages}
            style={[styles.pageButton, page === totalPages && styles.activePageButton]}
            onPress={() => handlePageChange(totalPages)}
          >
            <Text style={[styles.pageButtonText, page === totalPages && styles.activePageButtonText]}>{totalPages}</Text>
          </TouchableOpacity>
        );
      }

      // Next button
      pageButtons.push(
        <TouchableOpacity
          key="next"
          style={[styles.navButton, page === totalPages && styles.disabledNavButton]}
          onPress={() => page < totalPages && handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          <Icon name="chevron-right" size={18} color={page === totalPages ? "#ccc" : "#007bff"} />
        </TouchableOpacity>
      );
      
      return pageButtons;
    }

    return (
      <View style={styles.paginationContainer}>
        {renderPageNumbers()}
      </View>
    );
  };

  const renderEmptyState = () => {
    if (paginatedOrders.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="receipt-long" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>Không có đơn hàng nào</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>Danh sách đơn hàng</Text>
        
        {renderEmptyState()}
        
        <FlatList
          data={paginatedOrders}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
        />

        {renderPagination()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 10,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
    color: '#333',
  },
  listSubtitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Light',
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  listContent: {
    paddingBottom: 8,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: '#333',
  },
  orderDate: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
    color: '#666',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  viewButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#007bff',
    marginLeft: 4,
  },
  cardContent: {
    padding: 12,
  },
  customerSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#666',
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    maxWidth: 140, // Limit width to prevent overflow
  },
  sectionSubvalue: {
    fontSize: 12,
    fontFamily: 'Poppins-Light',
    color: '#666',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    minWidth: '30%',
  },
  tableValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  chip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    maxWidth: 130, // Limit width
  },
  chipText: {
    color: '#fff',
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  totalAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#28a745',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  pageButton: {
    padding: 6,
    borderRadius: 4,
    marginHorizontal: 2,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePageButton: {
    backgroundColor: '#007bff',
  },
  pageButtonText: {
    fontFamily: 'Poppins-Medium',
    color: '#333',
    fontSize: 14,
  },
  activePageButtonText: {
    color: '#fff'
  },
  navButton: {
    padding: 6,
    borderRadius: 4,
    marginHorizontal: 2,
    backgroundColor: '#f8f9fa',
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledNavButton: {
    opacity: 0.5,
  },
  ellipsis: {
    marginHorizontal: 2,
    fontSize: 14,
    color: '#666',
    alignSelf: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  }
});

export default OrderList;