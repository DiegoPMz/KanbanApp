export type AppError = {
	code: string; // "INVALID_EMAIL", "SERVER_ERROR"
	message: string; // Human-readable message
	details?: unknown; // any metadata
};

export type ResultErrors = AppError[];

export class Result<TValue> {
	value: TValue;
	isSuccess: boolean;
	errors: ResultErrors;

	private constructor(value: TValue, isSuccess: boolean, errors: ResultErrors) {
		this.value = value;
		this.isSuccess = isSuccess;
		this.errors = errors;
	}

	static Success<SValue>(value: SValue): Result<SValue> {
		return new Result<SValue>(value, true, []);
	}

	static Error<T>(errors: ResultErrors): Result<T> {
		return new Result<T>(null as T, false, errors);
	}
}
