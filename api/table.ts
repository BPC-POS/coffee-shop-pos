import axios, {AxiosResponse, AxiosInstance} from "axios";
import { Table, TableArea } from "@/types/table";

const tableApi: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL,
    headers: {
      'Content-Type': 'application/json',
    },
});

tableApi.interceptors.request.use(
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

const createTable = async (tableData: {
  name: string;
  capacity: number;
  notes: string;
  status: number;
  area_id: number; 
}): Promise<AxiosResponse> => {
  try {
      const response: AxiosResponse = await tableApi.post('/tables', tableData);
      return response;
  } catch (error: unknown) {
      console.error("Error creating table:", error);
      throw error;
  }
};

const getTables = async (): Promise<AxiosResponse<Table[]>> => {
  try {
      const response: AxiosResponse<Table[]> = await tableApi.get('/tables');
      return response;
  } catch (error: unknown) {
      console.error("Error fetching tables:", error);
      throw error;
  }
};

const getTableById = async (tableId: number): Promise<AxiosResponse<Table>> => {
    try {
        const response: AxiosResponse<Table> = await tableApi.get(`/tables/${tableId}`);
        return response;
        }
    catch (error: unknown) {
        console.error(`Error fetching table with ID ${tableId}:`, error);
        throw error;
    }
};

const updateTable = async (tableData: {
  id: number;
  name: string;
  capacity: number;
  notes: string; 
  status: number;
  areaId: number; 
}): Promise<AxiosResponse<Table>> => { 
  try {
    const response: AxiosResponse<Table> = await tableApi.patch(`/tables/${tableData.id}`, tableData); 
    return response;
  } catch (error: unknown) {
    console.error("Error updating table:", error);
    throw error;
  }
};

const deleteTable = async (tableId: number): Promise<AxiosResponse> => {
    try {
      const response: AxiosResponse = await tableApi.delete(`/tables/${tableId}`);
      return response;
    } catch (error: unknown) {
      console.error(`Error deleting table with ID ${tableId}:`, error);
      throw error;
    }
};

const getTableAreas = async (): Promise<AxiosResponse<TableArea[]>> => {
  try {
    const response: AxiosResponse<TableArea[]> = await tableApi.get('/table-area');
    return response;
  } catch (error: unknown) {
    console.error("Error fetching table areas:", error);
    throw error;
  }
};

const createTableArea = async (areaData: { name: string }): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await tableApi.post('/table-area', areaData);
    return response;
  } catch (error: unknown) {
    console.error("Error creating table area:", error);
    throw error;
  }
};

const updateTableArea = async (areaData: { id: number; name: string }): Promise<AxiosResponse> => {
  try {
      const response: AxiosResponse = await tableApi.patch(`/table-area/${areaData.id}`, { name: areaData.name });
      return response;
  } catch (error: unknown) {
      console.error("Error updating table area:", error);
      throw error;
  }
};

const deleteTableArea = async (areaId: number): Promise<AxiosResponse> => {
  try {
      const response: AxiosResponse = await tableApi.delete(`/table-area/${areaId}`);
      return response;
  } catch (error: unknown) {
      console.error(`Error deleting table area with ID ${areaId}:`, error);
      throw error;
  }
}

export { tableApi, createTable, getTables, getTableById, updateTable, deleteTable, getTableAreas, createTableArea, updateTableArea, deleteTableArea };

