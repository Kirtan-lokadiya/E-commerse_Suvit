import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://192.168.20.173:5000/api",
  baseURL: "https://e-commerce-project-gwmh.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "edfgdr",
  },
});

export default axiosInstance;
