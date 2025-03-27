import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Order, OrderStatus, OrderAPI, OrderStatusAPI, PaymentStatus } from '@/types/Order';
import BartenderOrderList from '@/components/bartender/BartenderOrderList';
import BartenderCompleteModal from '@/components/bartender/BartenderCompleteModal';
import BartenderRecipeModal from '@/components/bartender/BartenderRecipeModal';
import { getOrders, updateOrderStatus } from '@/api/order';

// Use the same mapping function as in the main bartender screen
const mapAPIOrderToComponentOrder = (apiOrder: OrderAPI): Order => {
  // Check if order has a status that should be shown in bartender view (1 = CONFIRMED, 2 = PREPARING)
  const orderStatus = 
    apiOrder.status === OrderStatusAPI.CONFIRMED
      ? OrderStatus.PENDING  // Map CONFIRMED (1) to PENDING for bartender view
      : apiOrder.status === OrderStatusAPI.PREPARING 
        ? OrderStatus.PREPARING 
        : apiOrder.status === OrderStatusAPI.COMPLETED 
          ? OrderStatus.COMPLETED 
          : OrderStatus.CANCELLED;

  return {
    id: apiOrder.id || 0,
    orderNumber: apiOrder.id?.toString() || '0',
    customerName: apiOrder.shipping_address || 'Customer',
    customerPhone: '',
    tableId: apiOrder.meta?.table_id,
    items: (apiOrder.orderItems || apiOrder.items || []).map((item, index) => ({
      id: item.id || index,
      productId: item.product_id,
      productName: item.product?.name || `Product ${item.product_id}`,
      quantity: item.quantity,
      price: Number(item.unit_price),
      note: typeof item.product?.meta?.recipes?.instructions === 'string' 
        ? item.product.meta.recipes.instructions 
        : ''
    })),
    status: orderStatus,
    paymentStatus: PaymentStatus.PAID,
    totalAmount: Number(apiOrder.total_amount),
    createdAt: new Date(apiOrder.createdAt || apiOrder.order_date),
    updatedAt: new Date(apiOrder.updatedAt || apiOrder.order_date)
  };
};

export default function PreparingOrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data.map(mapAPIOrderToComponentOrder));
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add a useFocusEffect to refetch orders when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
      return () => {};
    }, [])
  );

  const preparingOrders = useMemo(() => {
    return orders.filter(order => order.status === OrderStatus.PREPARING);
  }, [orders]);

  const handleViewRecipe = (productId: number) => {
    setSelectedProductId(productId);
    setRecipeModalVisible(true);
  };

  const handleCompletePrepare = (order: Order) => {
    setSelectedOrder(order);
    setCompleteModalVisible(true);
  };

  const handleConfirmComplete = async () => {
    if (selectedOrder) {
      try {
        await updateOrderStatus(selectedOrder.id, 4);
        // Update local state
        setOrders(orders.map(o => 
          o.id === selectedOrder.id 
            ? { ...o, status: OrderStatus.COMPLETED }
            : o
        ));
        router.push('/(main)/bartender/completed');
      } catch (error) {
        console.error("Error completing order:", error);
        Alert.alert("Error", "Failed to complete order");
      }
    }
    setCompleteModalVisible(false);
    setSelectedOrder(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading orders...</Text>
          </View>
        ) : preparingOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>No orders currently being prepared</Text>
          </View>
        ) : (
          <BartenderOrderList
            orders={preparingOrders}
            onViewRecipe={handleViewRecipe}
            onCompletePrepare={handleCompletePrepare}
            showStartButton={false}
          />
        )}
      </ScrollView>

      <BartenderCompleteModal
        visible={completeModalVisible}
        order={selectedOrder}
        onConfirm={handleConfirmComplete}
        onClose={() => {
          setCompleteModalVisible(false);
          setSelectedOrder(null);
        }}
      />

      <BartenderRecipeModal
        visible={recipeModalVisible}
        productId={selectedProductId}
        onClose={() => setRecipeModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50
  }
}); 