import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import OrderStats from '@/components/order/OrderStats';
import OrderFilter from '@/components/order/OrderFilter';
import { OrderFilter as OrderFilterType, Order, OrderStatus, PaymentStatus } from '@/types/Order';
import { mockOrders } from '@/mock/mockdata';
import OrderList from '@/components/order/OrderList';
import { ScrollView } from 'react-native-gesture-handler';

const OrdersScreen = () => {
  const [orderFilter, setOrderFilter] = useState<OrderFilterType>({});

  const handleFilterChange = (newFilter: OrderFilterType) => {
    console.log("OrderScreen - handleFilterChange - newFilter", newFilter);
    setOrderFilter(newFilter);
    // TODO : Thực hiện logic gọi api ở đây khi filter thay đổi
  };

    const filteredOrders = useMemo(() => {
        return mockOrders.filter((order) => {
          if (orderFilter.search) {
            const search = orderFilter.search.toLowerCase();
            if (
              !order.customerName.toLowerCase().includes(search) &&
              !order.orderNumber.toLowerCase().includes(search) &&
             !order.customerPhone?.includes(search)
            ) {
              return false;
            }
          }
          if (orderFilter.status && order.status !== orderFilter.status) {
            return false;
          }
            if (orderFilter.paymentStatus && order.paymentStatus !== orderFilter.paymentStatus) {
              return false;
          }
           if (orderFilter.startDate && order.createdAt < orderFilter.startDate) {
                return false
          }
          if(orderFilter.endDate && order.createdAt > orderFilter.endDate) {
               return false
           }


          return true;
        });
  }, [orderFilter]);



  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Danh sách đơn hàng',
          headerStyle: {
            backgroundColor: '#28a745',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <ScrollView style={styles.content}>
      <OrderStats orders={filteredOrders} />
      <OrderFilter
                filter={orderFilter}
                onFilterChange={handleFilterChange}
            />
      <OrderList orders={filteredOrders} onViewDetail={function (order: Order): void {
          throw new Error('Function not implemented.');
        } } onStatusChange={function (orderId: number, status: OrderStatus): void {
          throw new Error('Function not implemented.');
        } } onPaymentStatusChange={function (orderId: number, status: PaymentStatus): void {
          throw new Error('Function not implemented.');
        } } />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default OrdersScreen;