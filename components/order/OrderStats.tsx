import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Order, OrderStatus, PaymentStatus } from '@/types/Order';
import { formatCurrency } from '@/utils/format';

interface OrderStatsProps {
  orders: Order[];
}

const OrderStats: React.FC<OrderStatsProps> = ({ orders }) => {
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === OrderStatus.PENDING).length,
    preparing: orders.filter(o => o.status === OrderStatus.PREPARING).length,
    completed: orders.filter(o => o.status === OrderStatus.COMPLETED).length,
    cancelled: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
    unpaid: orders.filter(o => o.paymentStatus === PaymentStatus.UNPAID).length,
    totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
  };

  const statCards = [
    {
      title: 'Tổng đơn hàng',
      value: stats.total,
      icon: 'trending-up',
      color: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    // {
    //   title: 'Chờ xác nhận',
    //   value: stats.pending,
    //   icon: 'access-time',
    //   color: 'bg-orange-500/10',
    //   iconColor: 'text-orange-500',
    // },
    {
      title: 'Đang pha chế',
      value: stats.preparing,
      icon: 'access-time',
      color: 'bg-yellow-500/10',
      iconColor: 'text-yellow-500',
    },
    // {
    //   title: 'Hoàn thành',
    //   value: stats.completed,
    //   icon: 'check-circle',
    //   color: 'bg-green-500/10',
    //   iconColor: 'text-green-500',
    // },
    // {
    //   title: 'Đã hủy',
    //   value: stats.cancelled,
    //   icon: 'cancel',
    //   color: 'bg-red-500/10',
    //   iconColor: 'text-red-500',
    // },
    {
      title: 'Chưa thanh toán',
      value: stats.unpaid,
      icon: 'payment',
      color: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(stats.totalAmount),
      icon: 'local-atm',
      color: 'bg-emerald-500/10',
      iconColor: 'text-emerald-500',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {statCards.map((stat, index) => (
          <View key={index} style={styles.gridItem}>
            <View style={styles.card}>
              <View style={[styles.cardHeader, { backgroundColor: stat.color.replace('bg-', '') }]}>
                <View style={styles.iconContainer}>
                   <Icon name={stat.icon} size={32} color={stat.iconColor.replace('text-','')} />
                </View>
                <Text style={styles.cardValue}>{stat.value}</Text>
              </View>
              <Text style={styles.cardTitle}>{stat.title}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    transform: [{ translateY: 0 }],

  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12
  },
    iconContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 8,
        borderRadius: 8,
          shadowColor: '#000',
          shadowOffset: {
              width: 0,
              height: 1,
          },
          shadowOpacity: 0.18,
          shadowRadius: 1.00,
          elevation: 1,
    },
  cardValue: {
    fontSize: 20,
    fontWeight: '600',
     fontFamily: 'Poppins-SemiBold',
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: 'gray',
     fontFamily: 'Poppins-Medium',
  },
});

export default OrderStats;