import { Result, ResultError } from "./result";

export class Pagination {
	private constructor(
		public readonly limit: number,
		public readonly cursor?: string,
		public readonly offset?: number,
	) {}

	static create(limit: number, cursor?: string): Result<Pagination> {
		const valResult = Pagination.validation({ limit, cursor });

		return valResult.isSuccess
			? Result.Success(new Pagination(limit, cursor))
			: Result.Failure(valResult.errors);
	}

	private static validation(pagination: Pagination): Result<void> {
		const errors: ResultError[] = [];

		if (isNaN(pagination.limit) || pagination.limit < 1) {
			errors.push(paginationValidationErrors.invalidLimit(pagination.limit));
		}

		if (
			pagination.cursor !== undefined &&
			typeof pagination.cursor !== "string"
		) {
			errors.push(paginationValidationErrors.invalidCursor(pagination.cursor));
		}

		return errors.length > 0
			? Result.Failure(errors)
			: Result.Success(undefined as never);
	}
}

/**
 * Domain / Validation Errors for Pagination
 */
export const paginationValidationErrors = {
	invalidLimit: (limit: number): ResultError => ({
		code: "Pagination.InvalidLimit",
		message: `The limit '${limit}' is invalid. It must be a positive number greater than 0.`,
		type: "Validation",
		metadata: { field: "limit", value: limit, date: new Date().toISOString() },
	}),

	invalidCursor: (cursor: unknown): ResultError => ({
		code: "Pagination.InvalidCursor",
		message: `The cursor provided is not a valid string.`,
		type: "Validation",
		metadata: {
			field: "cursor",
			value: cursor,
			date: new Date().toISOString(),
		},
	}),
};

export const paginationErrorCodes = {
	InvalidLimit: "Pagination.InvalidLimit",
	InvalidCursor: "Pagination.InvalidCursor",
} as const;
