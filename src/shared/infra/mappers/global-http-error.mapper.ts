import { ResultError } from "@/shared/domain/result";
import { HttpClientErrorResponse } from "../http/axios-error.interceptor";
import { HttpStatusCode } from "axios";
import { globalErrors } from "@/shared/domain/errors/global.error";

/**
 * Translates generic HTTP status codes (401, 403, 500) into
 * global Domain ResultErrors.
 */
export const mapGlobalHttpError = (
	error: HttpClientErrorResponse,
): ResultError | null => {
	const status = error.response?.status ?? error.status;

	if (status === HttpStatusCode.Unauthorized)
		return globalErrors.authentication();
	if (status === HttpStatusCode.Forbidden) return globalErrors.authorization();
	if (!status || status >= 500) return globalErrors.serverError();

	return null;
};
