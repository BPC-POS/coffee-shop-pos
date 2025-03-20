import axios, { AxiosInstance, AxiosResponse } from 'axios';

const roleApi: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  roleApi.interceptors.request.use(
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
  
const getRole = async (): Promise<AxiosResponse> => { 
  try {
    const response: AxiosResponse = await roleApi.get("/roles");
    return response;
  } catch (error: unknown) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

export {getRole};