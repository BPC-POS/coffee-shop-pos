import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Role } from '@/types/User';

const roleApi: AxiosInstance = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

roleApi.interceptors.request.use(
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

const getRoles = async (): Promise<AxiosResponse<Role[]>> => {
  try {
    const response: AxiosResponse<Role[]> = await roleApi.get("/roles");
    return response;
  } catch (error: unknown) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export { getRoles };