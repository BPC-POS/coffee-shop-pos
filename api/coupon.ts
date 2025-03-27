import axios, { AxiosResponse, AxiosInstance } from "axios";
import { Coupon } from "../types/coupon";

const couponApi: AxiosInstance = axios.create({
  baseURL: 'https://bpc-pos-app-api.nibies.space',
  headers: {
    "Content-Type": "application/json",
    "accept": "*/*"
  },
});

couponApi.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getCoupons = async (): Promise<AxiosResponse<Coupon[]>> => {
  try {
    const response = await couponApi.get<Coupon[]>('/coupons');
    return response;
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw error;
  }
};

const createCoupon = async (couponData: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt'>): Promise<AxiosResponse<Coupon>> => {
  try {
    const response = await couponApi.post<Coupon>('/coupons', couponData);
    return response;
  } catch (error) {
    console.error("Error creating coupon:", error);
    throw error;
  }
};

const getCouponById = async (id: number): Promise<AxiosResponse<Coupon>> => {
  try {
    const response = await couponApi.get<Coupon>(`/coupons/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching coupon:", error);
    throw error;
  }
};

const updateCoupon = async (id: number, couponData: Partial<Coupon>): Promise<AxiosResponse<Coupon>> => {
  try {
    const response = await couponApi.patch<Coupon>(`/coupons/${id}`, couponData);
    return response;
  } catch (error) {
    console.error("Error updating coupon:", error);
    throw error;
  }
};

const deleteCoupon = async (id: number): Promise<AxiosResponse<void>> => {
  try {
    const response = await couponApi.delete(`/coupons/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting coupon:", error);
    throw error;
  }
};

export { couponApi, getCoupons, createCoupon, getCouponById, updateCoupon, deleteCoupon };
