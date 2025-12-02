import { httpClient } from "./httpClient";

httpClient.interceptors.response.use(
	(res) => res,
	(rej) => {
		console.log(rej);
	},
);
