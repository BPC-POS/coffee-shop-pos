import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Text, Alert, TouchableOpacity } from 'react-native';
import { Order, OrderStatus, OrderAPI, OrderStatusAPI, PaymentStatus } from '@/types/Order';
import BartenderOrderList from '@/components/bartender/BartenderOrderList';
import { getOrders } from '@/api/order';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

// Use the same mapping function as in other screens
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

export default function CompletedOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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
  }, []);

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      // Set time to beginning of the day
      selectedDate.setHours(0, 0, 0, 0);
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      // Set time to end of the day
      selectedDate.setHours(23, 59, 59, 999);
      setEndDate(selectedDate);
    }
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const filteredCompletedOrders = useMemo(() => {
    let filtered = orders.filter(order => order.status === OrderStatus.COMPLETED);
    
    if (startDate) {
      filtered = filtered.filter(order => order.createdAt >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(order => order.createdAt <= endDate);
    }
    
    // Sort by most recent first
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [orders, startDate, endDate]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={20} color="#007AFF" />
          <Text style={styles.filterToggleText}>
            {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc thời gian"}
          </Text>
        </TouchableOpacity>
        
        {showFilters && (
          <View style={styles.filtersContent}>
            <View style={styles.dateFilterRow}>
              <Text style={styles.filterLabel}>Từ ngày:</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {startDate ? startDate.toLocaleDateString() : "Chọn ngày bắt đầu"}
                </Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleStartDateChange}
                />
              )}
            </View>
            
            <View style={styles.dateFilterRow}>
              <Text style={styles.filterLabel}>Đến ngày:</Text>
              <TouchableOpacity 
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {endDate ? endDate.toLocaleDateString() : "Chọn ngày kết thúc"}
                </Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleEndDateChange}
                />
              )}
            </View>
            
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Đặt lại</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading completed orders...</Text>
          </View>
        ) : filteredCompletedOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>No completed orders in selected date range</Text>
          </View>
        ) : (
          <BartenderOrderList
            orders={filteredCompletedOrders}
            onViewRecipe={() => {}}
            showStartButton={false}
            showCompleteButton={false}
            showRecipeButton={false}
          />
        )}
      </ScrollView>
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
  },
  filterContainer: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  filterToggleText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007AFF',
  },
  filtersContent: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  dateFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterLabel: {
    width: 80,
    fontSize: 16,
  },
  dateButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    backgroundColor: '#fff',
  },
  dateText: {
    color: '#333',
  },
  resetButton: {
    backgroundColor: '#8b4513',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
}); 