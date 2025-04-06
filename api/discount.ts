import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Discount } from '../types/discount';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const discountApi: AxiosInstance = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'accept': '*/*'
  },
});

discountApi.interceptors.request.use(
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

const getDiscounts = async (): Promise<AxiosResponse<Discount[]>> => {
  try {
    const response = await discountApi.get<Discount[]>('/discounts');
    return response;
  } catch (error: unknown) {
    console.error("Error fetching discounts:", error);
    throw error;
  }
};

const createDiscount = async (discountData: Omit<Discount, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<Discount>> => {
  try {
    const response = await discountApi.post<Discount>('/discounts', discountData);
    return response;
  } catch (error: unknown) {
    console.error("Error creating discount:", error);
    throw error;
  }
};

const getDiscountByCode = async (code: string): Promise<AxiosResponse<Discount>> => {
  try {
    const response = await discountApi.get<Discount>(`/discounts/${code}`);
    return response;
  } catch (error: unknown) {
    console.error("Error fetching discount:", error);
    throw error;
  }
};

const updateDiscount = async (id: number, discountData: Partial<Discount>): Promise<AxiosResponse<Discount>> => {
  try {
    const response = await discountApi.patch<Discount>(`/discounts/${id}`, discountData);
    return response;
  } catch (error: unknown) {
    console.error("Error updating discount:", error);
    throw error;
  }
};

const deleteDiscount = async (id: number): Promise<AxiosResponse<void>> => {
  try {
    const response = await discountApi.delete(`/discounts/${id}`);
    return response;
  } catch (error: unknown) {
    console.error("Error deleting discount:", error);
    throw error;
  }
};

export { discountApi, getDiscounts, createDiscount, getDiscountByCode, updateDiscount, deleteDiscount };