import axios, { AxiosInstance, AxiosResponse } from 'axios';

const paymentApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_AUTH_URL, // Hoặc 'https://bpc-pos-admin-panel-api.nibies.space' nếu cần
  headers: {
    'Content-Type': 'application/json',
  },
});

paymentApi.interceptors.request.use(
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

/**
 * Lấy hình ảnh QR code thanh toán cho order với ID được cung cấp.
 *
 * @param {number} id - ID của order.
 * @returns {Promise<Blob>} - Promise resolve về Blob data của hình ảnh QR code.
 * @throws {Error} - Ném lỗi nếu có vấn đề trong quá trình gọi API.
 */
const getPaymentQRCodeImage = async (id: number): Promise<Blob> => {
  try {
    const response: AxiosResponse = await paymentApi.get(`/orders/${id}/invoice`, {
      responseType: 'blob',
    });

    return response.data;

  } catch (error: unknown) {
    console.error("Lỗi khi lấy hình ảnh QR code thanh toán:", error);

    if (axios.isAxiosError(error)) {
      console.error("Chi tiết lỗi Axios:", error.message, error.response?.status, error.response?.data);
      throw new Error(`Không thể lấy hình ảnh QR code thanh toán. ${error.message}. Status: ${error.response?.status || 'N/A'}`); 
    } else {
      throw new Error("Có lỗi không mong muốn xảy ra khi lấy hình ảnh QR code thanh toán."); 
    }
  }
};

export { getPaymentQRCodeImage }; 