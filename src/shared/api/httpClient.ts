import axios from "axios";

export const baseURL = import.meta.env.VITE_API_URL;

export const httpClient = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
		Accept: ["application/json"],
	},
	withCredentials: true,
});
