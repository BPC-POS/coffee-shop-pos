import React, { useState } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet } from 'react-native';
import { Order, OrderStatus, PaymentStatus } from '@/types/Order';
import { mockOrders } from '@/mock/mockdata';


const OrderListScreen = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  // Nhóm order theo trạng thái
  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.status]) acc[order.status] = [];
    acc[order.status].push(order);
    return acc;
  }, {} as Record<OrderStatus, Order[]>);

  // Chuyển đổi thành dữ liệu phù hợp cho SectionList
  const sections = Object.keys(groupedOrders).map((status) => ({
    title: status,
    data: groupedOrders[status as OrderStatus],
  }));

  // Render mỗi item trong danh sách order
  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderItem} onPress={() => handleOrderPress(item)}>
      <Text style={styles.orderNumber}>Đơn hàng: {item.orderNumber}</Text>
      <Text style={styles.customerName}>Khách hàng: {item.customerName}</Text>
      <Text style={styles.customerName}>Bàn: {item.tableId}</Text>
      <Text style={styles.totalAmount}>Tổng tiền: {item.totalAmount.toLocaleString()} VNĐ</Text>
    </TouchableOpacity>
  );

  // Render tiêu đề của mỗi section
  const renderSectionHeader = ({ section }: { section: { title: string } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.title}</Text>
    </View>
  );

  // Xử lý khi bấm vào một order
  const handleOrderPress = (order: Order) => {
    console.log('Order selected:', order);
    // Có thể điều hướng đến màn hình chi tiết đơn hàng
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        renderItem={renderOrderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent', // Đặt background trong suốt
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  listContainer: {
    paddingBottom: 16,
  },
  sectionHeader: {
    backgroundColor: 'rgba(0, 123, 255, 0.8)', // Màu nền với độ trong suốt
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  orderItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Màu nền với độ trong suốt
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
});

export default OrderListScreen;