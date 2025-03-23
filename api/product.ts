import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_PUBLIC_API_AUTH_URL } from '@env';

const productApi: AxiosInstance = axios.create({
  baseURL: `${REACT_PUBLIC_API_AUTH_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const imageApi: AxiosInstance = axios.create({
  baseURL: `${REACT_PUBLIC_API_AUTH_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

imageApi.interceptors.request.use(
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

productApi.interceptors.request.use(
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

interface ProductData {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  sku: string;
  status: number;
  image_url?: string;
  image_id?: string | number;
  meta: {
    image_url?: string;
    image_id?: string | number;
    extension?: string;
    recipes?: {
      ingredients: string;
      instructions: string;
    };
  };
  categories: number[];
  attributes: {
    attribute_id: number;
    value: string;
  }[];
  variants: {
    sku: string;
    price: number;
    stock_quantity: number;
    status: number;
    attributes: {
      attribute_id: number;
      value: string;
    }[];
  }[];
}

interface AttributeItem {
  attribute_id: number;
  value: string;
}

interface VariantItem {
  sku: string;
  price: number;
  stock_quantity: number;
  status: number;
  attributes: AttributeItem[];
}

const getProducts = async (): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await productApi.get('/products');
    return response;
  } catch (error: unknown) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const createProduct = async (productData: ProductData): Promise<AxiosResponse> => {
  console.log('=== API CREATE PRODUCT REQUEST ===');
  console.log('Request data:', productData);
  
  try {
    const sanitizedProductData = {
      ...productData,
      categories: productData.categories.map(categoryId => 
        typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId
      ).filter(id => !isNaN(id))
    };
    
    const response: AxiosResponse = await productApi.post('/products', sanitizedProductData);
    console.log('=== API CREATE PRODUCT RESPONSE ===');
    console.log('Full API response:', response);
    return response;
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    throw error;
  }
};

const updateProduct = async (productId: number, productData: Partial<ProductData>): Promise<AxiosResponse> => {
  console.log('=== API UPDATE PRODUCT REQUEST ===');
  console.log('Product ID:', productId);
  console.log('Request data:', productData);
  
  try {
    const sanitizedProductData: Partial<ProductData> = { ...productData };
    if (sanitizedProductData.categories) {
      sanitizedProductData.categories = (Array.isArray(sanitizedProductData.categories) 
        ? sanitizedProductData.categories 
        : []
      ).map((categoryId: string | number) => 
        typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId
      ).filter((id: number) => !isNaN(id));
    }

    if (sanitizedProductData.attributes) {
      sanitizedProductData.attributes = (Array.isArray(sanitizedProductData.attributes)
        ? sanitizedProductData.attributes
        : []
      ).filter((attr: Partial<AttributeItem>) => attr && attr.attribute_id && attr.value)
        .map((attr: Partial<AttributeItem>) => ({
          attribute_id: Number(attr.attribute_id),
          value: String(attr.value)
        }));
    }

    if (sanitizedProductData.variants) {
      sanitizedProductData.variants = (Array.isArray(sanitizedProductData.variants)
        ? sanitizedProductData.variants
        : []
      ).map((variant: Partial<VariantItem>) => ({
        sku: variant.sku || '',
        price: Number(variant.price) || 0,
        stock_quantity: Number(variant.stock_quantity) || 0,
        status: Number(variant.status) || 1,
        attributes: (Array.isArray(variant.attributes) ? variant.attributes : [])
          .filter((attr: Partial<AttributeItem>) => attr && attr.attribute_id && attr.value)
          .map((attr: Partial<AttributeItem>) => ({
            attribute_id: Number(attr.attribute_id),
            value: String(attr.value)
          }))
      }));
    }

    if (sanitizedProductData.meta) {
      sanitizedProductData.meta = {
        ...sanitizedProductData.meta,
        image_url: sanitizedProductData.meta.image_url || '',
        image_id: sanitizedProductData.meta.image_id || undefined,
        extension: sanitizedProductData.meta.extension || undefined
      };
    }

    if (sanitizedProductData.price !== undefined) {
      sanitizedProductData.price = Number(sanitizedProductData.price) || 0;
    }
    if (sanitizedProductData.stock_quantity !== undefined) {
      sanitizedProductData.stock_quantity = Number(sanitizedProductData.stock_quantity) || 0;
    }
    if (sanitizedProductData.status !== undefined) {
      sanitizedProductData.status = Number(sanitizedProductData.status) || 1;
    }
    
    console.log('Sanitized update data:', sanitizedProductData);
    const response: AxiosResponse = await productApi.patch(`/products/${productId}`, sanitizedProductData);
    console.log('=== API UPDATE PRODUCT RESPONSE ===');
    console.log('Full API response:', response);
    return response;
  } catch (error: unknown) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw error;
  }
};

const getProductById = async (productId: number): Promise<AxiosResponse> => {
    try {
      const response: AxiosResponse = await productApi.get(`/products/${productId}`);
      return response;
    } catch (error: unknown) {
      console.error(`Error fetching product with ID ${productId}:`, error);
      throw error;
    }
  };
  

  const deleteProductById = async (productId: number): Promise<AxiosResponse> => {
    try {
      const response: AxiosResponse = await productApi.delete(`/products/${productId}`);
      return response;
    } catch (error: unknown) {
      console.error(`Error deleting product with ID ${productId}:`, error);
      throw error;
    }
  };

  const uploadImage = async (formData: FormData): Promise<AxiosResponse> => {
    try {
      const authToken = localStorage.getItem('authToken');
            const headers: Record<string, string> = {
        'Content-Type': 'multipart/form-data',
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
      
      const response: AxiosResponse = await imageApi.post('/files/upload', formData, {
        headers,
      });
      
      return response;
    }
    catch (error: unknown) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  export { productApi, getProducts, createProduct, getProductById, deleteProductById, uploadImage, updateProduct };