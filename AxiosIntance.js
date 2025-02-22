import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://192.168.1.144:3000",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Xử lý response
AxiosInstance.interceptors.response.use(
  (response) => response.data, // Trả về dữ liệu luôn
  (error) => Promise.reject(error)
);

export default AxiosInstance;
