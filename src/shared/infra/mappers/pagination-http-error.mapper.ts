import {
	Pagination,
	paginationValidationErrors,
} from "@/shared/domain/pagination.value-object";
import { HttpClientErrorResponse } from "../http/axios-error.interceptor";
import { Result, ResultError } from "@/shared/domain/result";
import { mapGlobalHttpError } from "./global-http-error.mapper";
import { HttpStatusCode } from "axios";
import { globalErrors } from "@/shared/domain/errors/global.error";

export const mapHttpPaginationErrorToResult = <R>(
	error: HttpClientErrorResponse,
	pagination: Pagination,
): Result<R> => {
	const global = mapGlobalHttpError(error);
	if (global) return Result.Failure([global]);

	const statusCode = error.response?.status ?? error.status;
	const responseData = error.response?.data;

	if (statusCode === HttpStatusCode.BadRequest && responseData?.errors) {
		const validationErrors: ResultError[] = [];
		const fields = responseData.errors;

		if (fields.limit)
			validationErrors.push(
				paginationValidationErrors.invalidLimit(pagination.limit),
			);

		if (fields.cursor)
			validationErrors.push(
				paginationValidationErrors.invalidCursor(pagination.cursor),
			);

		if (validationErrors.length > 0) return Result.Failure(validationErrors);
	}

	return Result.Failure([globalErrors.serverError()]);
};
