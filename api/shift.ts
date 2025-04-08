import axios, { AxiosInstance, AxiosResponse } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Shift } from "@/types/Staff";

const shiftApi: AxiosInstance = axios.create({
    baseURL: Constants.expoConfig?.extra?.apiUrl,
    headers: {
    "Content-Type": "application/json",
  },
});

console.log("API URL:", Constants.expoConfig?.extra?.apiUrl);

shiftApi.interceptors.request.use(
    async (config) => {
        try {
          const authToken = await AsyncStorage.getItem('authToken'); 
          if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
          }
        } catch (error) {
          console.error("Error getting auth token from AsyncStorage:", error);
        }
        console.log("Request Headers:", config.headers);   // Log headers here
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

const getShifts = async (): Promise<AxiosResponse<Shift[]>> => {
  try {
    const response: AxiosResponse<Shift[]> = await shiftApi.get("/shifts");
    return response;
  } catch (error: unknown) {
    console.error("Error fetching shifts:", error);
    throw error;
  }
};

const createShift = async (shiftData: Shift): Promise<AxiosResponse<Shift>> => {
  try {
    const response: AxiosResponse<Shift> = await shiftApi.post("/shifts", shiftData);
    return response;
  } catch (error: unknown) {
    console.error("Error creating shift:", error);
    throw error;
  }
};

const updateShift = async (shiftId: number, shiftData: Shift): Promise<AxiosResponse<Shift>> => {
  try {
    const response: AxiosResponse<Shift> = await shiftApi.patch(`/shifts/${shiftId}`, shiftData);
    return response;
  } catch (error: unknown) {
    console.error("Error updating shift:", error);
    throw error;
  }
};

const deleteShift = async (shiftId: number): Promise<AxiosResponse<void>> => {
  try {
    const response: AxiosResponse<void> = await shiftApi.delete(`/shifts/${shiftId}`);
    return response;
  } catch (error: unknown) {
    console.error("Error deleting shift:", error);
    throw error;
  }
};

export { getShifts, createShift, updateShift, deleteShift };