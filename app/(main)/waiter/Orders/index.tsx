import React, { useState, useEffect } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Order, OrderStatus, OrderAPI, OrderStatusAPI } from '@/types/Order';
import { getOrders, updateOrderStatus } from '@/api/order';
import { Ionicons } from '@expo/vector-icons';

interface OrderSection {
  title: string;
  data: OrderAPI[];
  status: OrderStatusAPI;
}

const OrderListScreen = () => {
  const [orders, setOrders] = useState<OrderAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
    
    // Polling for updates every 10 seconds to stay synchronized with bartender
    const intervalId = setInterval(() => {
      fetchOrders();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrders();
      
      // Không cần map COMPLETED sang READY nữa vì chúng ta sẽ hiển thị riêng
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Get status display text
  const getStatusDisplay = (status: OrderStatusAPI): string => {
    switch (status) {
      case OrderStatusAPI.PENDING:
        return 'Chờ xác nhận';
      case OrderStatusAPI.CONFIRMED:
        return 'Đã xác nhận';
      case OrderStatusAPI.PREPARING:
        return 'Đang pha chế';
      case OrderStatusAPI.READY:
        return 'Sẵn sàng phục vụ';
      case OrderStatusAPI.COMPLETED:
        return 'Hoàn thành';
      case OrderStatusAPI.CANCELLED:
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  // Group orders by status with custom order
  const getOrderedSections = (orders: OrderAPI[]): OrderSection[] => {
    const statusOrder = [
      OrderStatusAPI.COMPLETED,    // Đã hoàn thành (hiển thị đầu tiên)
      OrderStatusAPI.READY,        // Sẵn sàng phục vụ
      OrderStatusAPI.PREPARING,    // Đang pha chế
      OrderStatusAPI.CONFIRMED,    // Đã xác nhận
      OrderStatusAPI.CANCELLED,    // Đã hủy
    ];

    // Create empty groups for all statuses
    const groupedOrders = statusOrder.reduce((acc, status) => {
      acc[status] = [];
      return acc;
    }, {} as Record<OrderStatusAPI, OrderAPI[]>);

    // Group orders by status
    orders.forEach(order => {
      if (groupedOrders[order.status]) {
        groupedOrders[order.status].push(order);
      }
    });

    // Sort completed orders by completion time (most recent first)
    if (groupedOrders[OrderStatusAPI.COMPLETED]) {
      groupedOrders[OrderStatusAPI.COMPLETED].sort((a, b) => {
        return new Date(b.updatedAt || b.order_date).getTime() - 
               new Date(a.updatedAt || a.order_date).getTime();
      });
    }

    // Convert to sections in specified order
    return statusOrder
      .map(status => ({
        title: getStatusDisplay(status),
        data: groupedOrders[status],
        status: status
      }))
      .filter(section => section.data.length > 0);
  };

  // Get status color
  const getStatusColor = (status: OrderStatusAPI): string => {
    switch (status) {
      case OrderStatusAPI.PENDING:
        return '#ffc107'; // warning yellow
      case OrderStatusAPI.CONFIRMED:
        return '#17a2b8'; // info blue
      case OrderStatusAPI.PREPARING:
        return '#007bff'; // primary blue
      case OrderStatusAPI.READY:
        return '#28a745'; // success green
      case OrderStatusAPI.COMPLETED:
        return '#2ecc71'; // bright green
      case OrderStatusAPI.CANCELLED:
        return '#dc3545'; // danger red
      default:
        return '#6c757d';
    }
  };

  // Handle order status update
  const handleUpdateStatus = async (order: OrderAPI, newStatus: OrderStatusAPI) => {
    try {
      setUpdatingOrderId(order.id!);
      await updateOrderStatus(order.id!, newStatus);
      await fetchOrders();
      Alert.alert(
        'Thành công',
        `Đã cập nhật trạng thái đơn hàng #${order.id} thành ${getStatusDisplay(newStatus)}`
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      Alert.alert(
        'Lỗi',
        'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại sau.'
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Confirm order completion
  const confirmOrderCompletion = (order: OrderAPI) => {
    Alert.alert(
      'Xác nhận hoàn thành',
      `Bạn có chắc muốn đánh dấu đơn hàng #${order.id} là đã hoàn thành?`,
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xác nhận',
          onPress: () => handleUpdateStatus(order, OrderStatusAPI.COMPLETED)
        }
      ]
    );
  };

  const renderOrderItem = ({ item }: { item: OrderAPI }) => {
    const isUpdating = updatingOrderId === item.id;
    const isReadyStatus = item.status === OrderStatusAPI.READY;
    const isCompletedStatus = item.status === OrderStatusAPI.COMPLETED;

    // Calculate total items
    const totalItems = item.items?.reduce((sum, orderItem) => sum + orderItem.quantity, 0) || 0;

    return (
      <View style={[
        styles.orderItem,
        isCompletedStatus && styles.completedOrderItem
      ]}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>Đơn #{item.id}</Text>
            <Text style={styles.orderTable}>Bàn: {item.meta?.table_id || 'Chưa xác định'}</Text>
            {isCompletedStatus && (
              <Text style={styles.completedTime}>
                Hoàn thành: {new Date(item.updatedAt || item.order_date).toLocaleTimeString()}
              </Text>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{getStatusDisplay(item.status)}</Text>
          </View>
        </View>

        <View style={styles.orderSummary}>
          <Text style={styles.summaryText}>Tổng tiền: {item.total_amount.toLocaleString()}đ</Text>
        </View>
        
        {isReadyStatus && !isUpdating && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: getStatusColor(OrderStatusAPI.COMPLETED) }]}
            onPress={() => confirmOrderCompletion(item)}
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text style={styles.actionButtonText}>
              Đánh dấu hoàn thành
            </Text>
          </TouchableOpacity>
        )}

        {isUpdating && (
          <View style={styles.updatingContainer}>
            <ActivityIndicator color="#007bff" />
            <Text style={styles.updatingText}>Đang cập nhật...</Text>
          </View>
        )}
      </View>
    );
  };

  const renderSectionHeader = ({ section }: { section: OrderSection }) => (
    <View style={[styles.sectionHeader, { backgroundColor: getStatusColor(section.status) }]}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length} đơn</Text>
    </View>
  );

  if (loading && orders.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Đang tải danh sách đơn hàng...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchOrders}
        >
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchOrders}
        >
          <Ionicons name="refresh" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>
      <SectionList<OrderAPI, OrderSection>
        sections={getOrderedSections(orders)}
        renderItem={renderOrderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id!.toString()}
        contentContainerStyle={styles.listContainer}
        onRefresh={fetchOrders}
        refreshing={loading}
        stickySectionHeadersEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 16,
    paddingHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginTop: 12,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionCount: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderTable: {
    fontSize: 16,
    color: '#666',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryText: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },
  itemsList: {
    marginTop: 8,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productInfo: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  productMeta: {
    fontSize: 14,
    color: '#666',
  },
  productTotal: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  noItemsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  updatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  updatingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  completedOrderItem: {
    backgroundColor: '#f0fff4', // Light green background
    borderLeftWidth: 4,
    borderLeftColor: '#2ecc71',
  },
  completedTime: {
    fontSize: 14,
    color: '#2ecc71',
    marginTop: 4,
    fontWeight: '500',
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic',
  },
  productRecipes: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default OrderListScreen;