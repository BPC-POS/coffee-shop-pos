import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Category } from '@/types/Product';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const categoryApi: AxiosInstance = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

categoryApi.interceptors.request.use(
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

const getCategories = async (): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await categoryApi.get('/product-categories');
    return response;
  } catch (error: unknown) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

const createCategory = async (categoryData: Omit<Category, 'id' | 'image'>): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await categoryApi.post('/product-categories', {
      parent_id: null, 
      name: categoryData.name,
      description: categoryData.description,
      status: categoryData.isActive ? 1 : 0, 
    });
    return response;
  } catch (error: unknown) {
    console.error("Error creating category:", error);
    throw error;
  }
};

const getCategorybyId = async (): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await categoryApi.get('/product-categories');
    return response;
  } catch (error: unknown) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

const deleteCategoryById = async (id: number): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await categoryApi.delete(`/product-categories/${id}`);
    return response;
  } catch (error: unknown) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export { categoryApi, getCategories, createCategory, getCategorybyId, deleteCategoryById };