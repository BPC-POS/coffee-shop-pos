import axios, { AxiosInstance, AxiosResponse } from 'axios';

const authApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const signIn = async (email: string, password: string): Promise<AxiosResponse> => {
  try {
    const response: AxiosResponse = await authApi.post('/v1/auth/sign-in', {
      email: email,
      password: password,
    });
    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);
    throw error;
  }
};

export { authApi, signIn };