import axios, { AxiosResponse, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Staff } from '@/types/Staff';

const employeeApi: AxiosInstance = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

employeeApi.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
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

const getEmployees = async (): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await employeeApi.get('/employees');
    console.log("Employees fetched:", response.data);
    return response;
  } catch (error: unknown) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

const createEmployee = async (employeeData: Staff): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await employeeApi.post('/employees', {
      name: employeeData.name,
      email: employeeData.email,
      phone_number: employeeData.phone_number,
      role_id: employeeData.role_id,
      status: employeeData.status,
      member_id: employeeData.member_id,
      shifts: employeeData.shifts,
    });
    return response;
  } catch (error: unknown) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

const getEmployeeById = async (id: number): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await employeeApi.get(`/employees/${id}`);
    return response;
  } catch (error: unknown) {
    console.error("Error fetching employee:", error);
    throw error;
  }
}

const updateEmployeeById = async (id: number, employeeData: Staff): Promise<AxiosResponse> => {
  try {
    console.log("Updating employee:", id, employeeData);
    const response: AxiosResponse = await employeeApi.patch(`/employees/${id}`, { 
      name: employeeData.name,
      email: employeeData.email,
      phone_number: employeeData.phone_number,
      role_id: employeeData.role_id,
      status: employeeData.status,
      member_id: employeeData.member_id,
      shifts: employeeData.shifts,
    });
    return response;
  } catch (error: unknown) {
    console.error("Error updating employee:", error);
    throw error;
  }
}

const deleteEmployeeById = async (id: number): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await employeeApi.delete(`/employees/${id}`);
    return response;
  } catch (error: unknown) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

export { employeeApi, getEmployees, createEmployee, getEmployeeById, updateEmployeeById, deleteEmployeeById };