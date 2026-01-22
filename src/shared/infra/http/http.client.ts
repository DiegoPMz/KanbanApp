import axios, { CreateAxiosDefaults } from "axios";
import { errorInterceptor } from "./axios-error.interceptor";

export const baseURL = import.meta.env.VITE_API_URL;

const config: CreateAxiosDefaults = {
	baseURL,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	withCredentials: true,
	timeout: 2500,
};

export const httpClient = axios.create(config);

httpClient.interceptors.response.use((res) => res, errorInterceptor);
