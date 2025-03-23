import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { REACT_PUBLIC_API_AUTH_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authApi: AxiosInstance = axios.create({
  baseURL: `${REACT_PUBLIC_API_AUTH_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const signIn = async (email: string, password: string): Promise<AxiosResponse> => {
  try {
    const requestBody = {
      email: email,
      password: password,
    };
    const response: AxiosResponse = await authApi.post('/v1/auth/sign-in', requestBody);

    if (response.status >= 200 && response.status < 300) {
      const authToken = response.data.token; 
      if (authToken) {
        await AsyncStorage.setItem('authToken', authToken); 
      }
    }

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    throw error;
  }
};

export { authApi, signIn };