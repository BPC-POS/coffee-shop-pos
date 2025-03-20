import axios, { AxiosResponse, AxiosInstance } from "axios";
import { Coupon } from "@/types/coupon";

const couponApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL,
  headers: {
    "Content-Type": "application/json",
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

const getCoupon = async (): Promise<Coupon> => {
  try {
    const response: AxiosResponse = await couponApi.get(`/coupons/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createCoupon = async (couponData: Coupon): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await couponApi.post(
      "/coupons",
      couponData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const updateCoupon = async (
  id: number,
  couponData: Coupon
): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await couponApi.patch(
      `/coupons/${id}`,
      couponData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const deleteCoupon = async (id: number): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await couponApi.delete(`/coupons/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export { getCoupon, createCoupon, updateCoupon, deleteCoupon };
