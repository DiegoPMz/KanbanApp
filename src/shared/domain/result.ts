export type ErrorTypes =
	| "Validation"
	| "Conflict"
	| "Internal"
	| "Not_found"
	| "Authentication"
	| "Authorization";

export type ResultError = {
	readonly code: string;
	readonly message: string;
	readonly type: ErrorTypes;
	readonly metadata?: Record<string, unknown>;
};

export class Result<TValue> {
	readonly value: TValue | null;
	readonly isSuccess: boolean;
	readonly errors: ReadonlyArray<ResultError>;

	private constructor(
		value: TValue | null,
		isSuccess: boolean,
		errors: ResultError[],
	) {
		this.value = value;
		this.isSuccess = isSuccess;
		this.errors = errors;
	}

	static Success<T>(value: T): Result<T> {
		return new Result(value, true, []);
	}

	static Failure<T>(errors: ResultError[]): Result<T> {
		if (errors.length === 0) {
			console.warn("Warning: Result.Failure created with no errors.");
		}
		return new Result<T>(null, false, errors);
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
