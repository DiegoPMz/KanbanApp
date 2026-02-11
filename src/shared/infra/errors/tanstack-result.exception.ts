import { ErrorTypes, ResultError } from "@/shared/domain/result";

const ERROR_PRIORITY: ErrorTypes[] = [
	"Authentication",
	"Authorization",
	"Internal",
	"Conflict",
	"Not_found",
	"Validation",
];

/**
 * A technical wrapper that transforms a ResultError into a throwable Exception.
 * Primarily used in the Infrastructure layer to allow TanStack Query
 * to intercept domain-specific failures while preserving error metadata.
 */
export class TanStackError extends Error {
	public readonly type: ResultError["type"];
	public readonly code: ResultError["code"];
	public readonly metadata: ResultError["metadata"];

	constructor(error: ResultError) {
		super(error.message);
		this.type = error.type;
		this.name = error.code;
		this.code = error.code;
		this.metadata = error.metadata;
	}
}

/**
 * Evaluates a list of result errors and returns a prioritized exception.
 * It selects the most critical error based on a predefined priority hierarchy.
 * * @param errors - An array of ResultError objects to be processed.
 * @returns A TanStackError if an error is found, otherwise null.
 */
export const commonErrorHandler = (
	errors: readonly ResultError[],
): TanStackError | null => {
	if (errors.length === 0) return null;
	for (const type of ERROR_PRIORITY) {
		const error = errors.find((e) => e.type === type);
		if (error) return new TanStackError(error);
	}

	return null;
};
