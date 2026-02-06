import { Result } from "@/shared/domain/result";
import {
	commonErrorHandler,
	TanStackError,
} from "@/shared/infra/errors/TanStackError";

/**
 * Processes a service result and throws an exception if it fails.
 * @param context Name of the operation for traceability (e.g., 'getUserProfile')
 */
export const resultHandler = <T>(context: string, result: Result<T>): T => {
	if (result.isSuccess) return result.value as T;

	const exception = commonErrorHandler(result.errors);
	if (exception) throw exception;

	throw new TanStackError({
		code: `${context}.UnknownError`,
		type: "Internal",
		message: `Something went wrong in ${context}. Please try again or contact support if the problem persists.`,
		metadata: {
			context,
			date: new Date().toISOString(),
			originalErrors: result.errors,
		},
	});
};
