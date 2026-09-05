import axios from "axios";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}api`;
const axiosInstance = axios.create({
	baseURL: API_BASE_URL,
});

export default axiosInstance;