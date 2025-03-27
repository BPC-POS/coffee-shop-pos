import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Text } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Order, OrderStatus, OrderStatusAPI, OrderAPI, PaymentStatus } from '@/types/Order';
import BartenderOrderList from '@/components/bartender/BartenderOrderList';
import BartenderRecipeModal from '@/components/bartender/BartenderRecipeModal';
import BartenderCompleteModal from '@/components/bartender/BartenderCompleteModal';
import BartenderNotificationModal from '@/components/bartender/BartenderNotificationModal';
import { getOrders, updateOrderStatus } from '@/api/order';

// Helper function to convert API orders to the format expected by components
const mapAPIOrderToComponentOrder = (apiOrder: OrderAPI): Order => {
  // Check if order has a status that should be shown in bartender view (1 = CONFIRMED, 2 = PREPARING)
  // Note: OrderStatusAPI.PENDING = 6, but the API returns 1 for new orders that are confirmed
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

const BartenderScreen = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [prevOrderCount, setPrevOrderCount] = useState(0);
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const [selectedProductRecipe, setSelectedProductRecipe] = useState<{ ingredients: string, instructions: string } | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      const mappedOrders = response.data.map(mapAPIOrderToComponentOrder);
      setOrders(mappedOrders);
      
      if (mappedOrders.filter(o => o.status === OrderStatus.PENDING).length > prevOrderCount) {
        setHasNewOrder(true);
      }
      
      setPrevOrderCount(mappedOrders.filter(o => o.status === OrderStatus.PENDING).length);
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Poll for new orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter PENDING orders
  const pendingOrders = useMemo(() => {
    console.log('Orders available:', orders.length);
    console.log('Orders with PENDING status:', orders.filter(order => order.status === OrderStatus.PENDING).length);
    return orders.filter(order => order.status === OrderStatus.PENDING);
  }, [orders]);

  const handleViewRecipe = (productId: number) => {
    // Find the product in the orders
    const foundProduct = orders.flatMap(order => 
      order.items.filter(item => item.productId === productId)
    )[0];
    
    if (foundProduct) {
      setSelectedProductId(productId);
      // Extract recipe data if available
      const recipeInfo = foundProduct.note 
        ? { ingredients: '', instructions: foundProduct.note }
        : null;
      setSelectedProductRecipe(recipeInfo);
      setRecipeModalVisible(true);
    }
  };

  const handleStartPrepare = async (order: Order) => {
    try {
      await updateOrderStatus(order.id, OrderStatusAPI.PREPARING);
      // Update local state - remove from pending orders
      setOrders(orders.filter(o => o.id !== order.id));
      // Show confirmation alert
      Alert.alert(
        "Đã bắt đầu pha chế", 
        `Đơn hàng #${order.orderNumber} đã chuyển sang trạng thái pha chế`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error starting order preparation:", error);
      Alert.alert("Error", "Failed to update order status");
    }
  };

  const handleCompletePrepare = (order: Order) => {
    setSelectedOrder(order);
    setCompleteModalVisible(true);
  };

  const handleCancelOrder = async (order: Order) => {
    try {
      await updateOrderStatus(order.id, OrderStatusAPI.CANCELLED);
      // Update local state
      setOrders(orders.map(o => 
        o.id === order.id 
          ? { ...o, status: OrderStatus.CANCELLED }
          : o
      ));
    } catch (error) {
      console.error("Error canceling order:", error);
      Alert.alert("Error", "Failed to cancel order");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Pha chế',
          headerStyle: { backgroundColor: '#8b4513' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <TouchableOpacity onPress={() => {
              setIsNotificationVisible(true);
              setHasNewOrder(false);
            }}>
              <Ionicons 
                name={hasNewOrder ? 'notifications' : 'notifications-outline'} 
                size={24} 
                color="white" 
                style={{ marginRight: 10 }} 
              />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading orders...</Text>
          </View>
        ) : pendingOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>No pending orders</Text>
          </View>
        ) : (
          <BartenderOrderList
            orders={pendingOrders}
            onViewRecipe={handleViewRecipe}
            onStartPrepare={handleStartPrepare}
            onCompletePrepare={handleCompletePrepare}
            onCancelOrder={handleCancelOrder}
          />
        )}
      </ScrollView>

      <BartenderRecipeModal
        visible={recipeModalVisible}
        productId={selectedProductId}
        onClose={() => setRecipeModalVisible(false)}
      />

      <BartenderCompleteModal
        visible={completeModalVisible}
        order={selectedOrder}
        onConfirm={async () => {
          if (selectedOrder) {
            try {
              await updateOrderStatus(selectedOrder.id, OrderStatusAPI.COMPLETED);
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
        }}
        onClose={() => setCompleteModalVisible(false)}
      />

      <BartenderNotificationModal
        isVisible={isNotificationVisible}
        onClose={() => setIsNotificationVisible(false)}
        notifications={pendingOrders}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1 },
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

export default BartenderScreen;
