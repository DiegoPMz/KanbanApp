import { ResultError } from "../result";

export const globalErrors = {
	authentication: (message = "Session expired"): ResultError => ({
		code: "Global.Unauthorized",
		type: "Authentication",
		message: message,
	}),
	authorization: (message = "Permission denied"): ResultError => ({
		code: "Global.Forbidden",
		type: "Authorization",
		message: message,
	}),
	serverError: (): ResultError => ({
		code: "Global.Internal",
		type: "Internal",
		message: "An unexpected server error occurred.",
	}),
};
