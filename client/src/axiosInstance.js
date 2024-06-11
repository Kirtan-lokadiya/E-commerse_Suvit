import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.20.173:5000/api",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "edfgdr",
  },
});

export default axiosInstance;
