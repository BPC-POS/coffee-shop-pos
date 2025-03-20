import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Member } from "@/types/user";

const memberApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

memberApi.interceptors.request.use(
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

const getMembers = async (): Promise<AxiosResponse<Member[]>> => { 
  try {
    const response: AxiosResponse<Member[]> = await memberApi.get("/members");
    return response;
  } catch (error: unknown) {
    console.error("Error fetching members:", error);
    throw error;
  }
};

const createMember = async (memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'password' > & { password?: string }): Promise<AxiosResponse<Member>> => { // Chấp nhận Member interface, loại bỏ id và các trường tự động, password là optional khi update
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

export { memberApi, getMembers, createMember, getMemberById, updateMember, deleteMember };