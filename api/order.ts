import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { OrderAPI } from '@/types/order';

const orderApi: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  orderApi.interceptors.request.use(
    (config) => {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
const getOrder = async (): Promise<AxiosResponse> => { 
  try {
    const response: AxiosResponse = await orderApi.get("/orders");
    return response;
  } catch (error: unknown) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

const createOrder = async (orderData: OrderAPI): Promise<AxiosResponse> => {
  try {
    const formattedOrderData = {
      ...orderData,
      order_date: orderData.order_date instanceof Date ? orderData.order_date.toISOString() : orderData.order_date
    };

    const response: AxiosResponse = await orderApi.post("/orders", formattedOrderData);
    return response;
  } catch (error: unknown) {
    console.error("Error creating order:", error);
    throw error;
  }
};

const updateOrder = async (id: number, orderData: OrderAPI): Promise<AxiosResponse> => {
  try {
    const formattedOrderData = {
      ...orderData,
      order_date: orderData.order_date instanceof Date ? orderData.order_date.toISOString() : orderData.order_date
    };

    const response: AxiosResponse = await orderApi.put(`/orders/${id}`, formattedOrderData);
    return response;
  } catch (error: unknown) {
    console.error("Error updating order:", error);
    throw error;
  }
};

const getOrderById = async (id: number): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await orderApi.get(`/orders/${id}`);
    return response;
  } catch (error: unknown) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export {getOrder, createOrder, updateOrder, getOrderById}

