import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { OrderAPI } from '../types/Order';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const orderApi: AxiosInstance = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*'
  },
});

orderApi.interceptors.request.use(
  async (config) => {
    try {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
    } catch (error) {
      console.error("Error getting auth token from AsyncStorage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getOrders = async (): Promise<AxiosResponse<OrderAPI[]>> => {
  try {
    const response = await orderApi.get<OrderAPI[]>('/orders');
    return response;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

const createOrder = async (orderData: Omit<OrderAPI, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<OrderAPI>> => {
  try {
    const formattedOrderData = {
      ...orderData,
      order_date: orderData.order_date instanceof Date ? orderData.order_date.toISOString() : orderData.order_date
    };

    console.log("Order API Request Data:", formattedOrderData);
    const response = await orderApi.post<OrderAPI>('/orders', formattedOrderData);
    return response;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

const updateOrder = async (id: number, orderData: Partial<OrderAPI>): Promise<AxiosResponse<OrderAPI>> => {
  try {
    const formattedOrderData = {
      ...orderData,
      order_date: orderData.order_date instanceof Date ? orderData.order_date.toISOString() : orderData.order_date
    };

    const response = await orderApi.patch<OrderAPI>(`/orders/${id}`, formattedOrderData);
    return response;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

const getOrderById = async (id: number): Promise<AxiosResponse<OrderAPI>> => {
  try {
    const response = await orderApi.get<OrderAPI>(`/orders/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

const deleteOrder = async (id: number): Promise<AxiosResponse<void>> => {
  try {
    const response = await orderApi.delete(`/orders/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

const updateOrderStatus = async (id: number, status: number): Promise<AxiosResponse<OrderAPI>> => {
  try {
    const response = await orderApi.patch<OrderAPI>(`/orders/${id}`, { status });
    return response;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export { orderApi, getOrders, createOrder, updateOrder, getOrderById, deleteOrder, updateOrderStatus };

