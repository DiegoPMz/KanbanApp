export type ErrorTypes =
	| "Validation"
	| "Conflict"
	| "Internal"
	| "Not_found"
	| "Authentication"
	| "Authorization";

export const errorTypes = {
	Authentication: "Authentication",
	Authorization: "Authorization",
	Conflict: "Conflict",
	Internal: "Internal",
	Not_found: "Not_found",
	Validation: "Validation",
} as const;

export type ResultError = {
	readonly code: string;
	readonly message: string;
	readonly type: ErrorTypes;
	readonly metadata?: Record<string, unknown>;
};

export class Result<TValue> {
	readonly value: TValue;
	readonly isSuccess: boolean;
	readonly errors: ReadonlyArray<ResultError>;

	private constructor(
		value: TValue,
		isSuccess: boolean,
		errors: readonly ResultError[],
	) {
		this.value = value;
		this.isSuccess = isSuccess;
		this.errors = errors;
	}

	static Success<T>(value: T): Result<T> {
		return new Result(value, true, []);
	}

	static Failure<T>(errors: readonly ResultError[]): Result<T> {
		if (errors.length === 0) {
			console.warn("Warning: Result.Failure created with no errors.");
		}
		return new Result<T>(null as T, false, errors);
	}

	match<R>(
		onSuccess: (value: TValue) => R,
		onFailure: (errors: ReadonlyArray<ResultError>) => R,
	): R {
		return this.isSuccess && this.value
			? onSuccess(this.value)
			: onFailure(this.errors);
	}

	get error(): ResultError | undefined {
		return this.errors[0];
	}
}
