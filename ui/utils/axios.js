import axios from "axios";

export const API_URL = "https://localhost:5500/";

var axiosInstance = axios.create({
  baseURL: API_URL,
});

export default axiosInstance;
