import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Member } from "@/types/User";
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const memberApi: AxiosInstance = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

memberApi.interceptors.request.use(
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

const getMe = async (): Promise<AxiosResponse<Member>> => {
  try {
    const response: AxiosResponse<Member> = await memberApi.get("/members/me");
    return response;
  } catch (error: unknown) {
    console.error("Error fetching member profile (me):", error);
    throw error;
  }
};

const getMembers = async (): Promise<AxiosResponse<Member[]>> => { 
  try {
    const response: AxiosResponse<Member[]> = await memberApi.get("/members");
    return response;
  } catch (error: unknown) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

const createMember = async (memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'password' > & { password?: string }): Promise<AxiosResponse<Member>> => {
  try {
    const response: AxiosResponse<Member> = await memberApi.post("/members", memberData);
    return response;
  } catch (error: unknown) {
    console.error("Error creating member:", error);
    throw error;
  }
};

const getMemberById = async (id: number): Promise<AxiosResponse<Member>> => {
  try {
    const response: AxiosResponse<Member> = await memberApi.get(`/members/${id}`);
    return response;
  }
  catch (error: unknown) {
    console.error("Error fetching member:", error);
    throw error;
  } 
};

const updateMember = async (id: number, memberData: Partial<Member>): Promise<AxiosResponse<Member>> => {
  try {
    const response: AxiosResponse<Member> = await memberApi.put(`/members/${id}`, memberData);
    return response;
  } catch (error: unknown) {
    console.error("Error updating member:", error);
    throw error;
  }
};

const deleteMember = async (id: number): Promise<void> => {
  try {
    await memberApi.delete(`/members/${id}`);
  } catch (error: unknown) {
    console.error("Error deleting member:", error);
    throw error;
  }
};

export { memberApi, getMembers, createMember, getMemberById, updateMember, deleteMember, getMe };