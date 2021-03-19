import axios from "axios";

export const API_URL = "http://localhost:5000/";

var axiosInstance = axios.create({
  baseURL: API_URL,
});

export default axiosInstance;
