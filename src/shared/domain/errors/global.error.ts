import { errorTypes, ResultError } from "../result";

export const globalErrors = {
	authentication: (message = "Session expired"): ResultError => ({
		code: "Global.Unauthorized",
		type: errorTypes.Authentication,
		message: message,
	}),
	authorization: (message = "Permission denied"): ResultError => ({
		code: "Global.Forbidden",
		type: errorTypes.Authorization,
		message: message,
	}),
	serverError: (): ResultError => ({
		code: "Global.Internal",
		type: errorTypes.Internal,
		message: "An unexpected server error occurred.",
	}),
};

export const globalErrorCodes = {
	[errorTypes.Authentication]: "Global.Unauthorized",
	[errorTypes.Authorization]: "Global.Forbidden",
	[errorTypes.Internal]: "Global.Internal",
} as const;
