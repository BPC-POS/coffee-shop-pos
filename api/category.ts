import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Category } from '@/types/product';

const categoryApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

categoryApi.interceptors.request.use(
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