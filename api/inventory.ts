import axios, { AxiosInstance, AxiosResponse } from 'axios';

interface Inventory {
    product_id: number;
    quantity: number;
    adjustment_type: string;
};

const inventoryApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

inventoryApi.interceptors.request.use(
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

const getInventory = async (): Promise<AxiosResponse<Inventory[]>> => {
    try {
        const response: AxiosResponse<Inventory[]> = await inventoryApi.get('/inventory');
        return response;
    } catch (error: unknown) {
        console.error("Error fetching inventory:", error);
        throw error;
    }
}

const createInventory = async (inventoryData: Inventory): Promise<AxiosResponse<Inventory>> => {
    try {
        const response: AxiosResponse<Inventory> = await inventoryApi.post('/inventory', inventoryData);
        return response;
    } catch (error: unknown) {
        console.error("Error creating inventory:", error);
        throw error;
    }
}

const updateInventory = async (id: number, inventoryData: Partial<Inventory>): Promise<AxiosResponse<Inventory>> => { 
    try {
        const response: AxiosResponse<Inventory> = await inventoryApi.put(`/inventory/${id}`, inventoryData);
        return response;
    } catch (error: unknown) {
        console.error("Error updating inventory:", error);
        throw error;
    }
};

const deleteInventoryById = async (id: number): Promise<AxiosResponse<Inventory>> => {
    try {
        const response: AxiosResponse<Inventory> = await inventoryApi.delete(`/inventory/${id}`);
        return response;
    } catch (error: unknown) {
        console.error("Error deleting inventory:", error);
        throw error;
    }
};

export { getInventory, createInventory, updateInventory, deleteInventoryById };