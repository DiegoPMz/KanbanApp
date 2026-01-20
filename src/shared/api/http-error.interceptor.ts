import { AxiosError, HttpStatusCode, InternalAxiosRequestConfig } from "axios";
import z from "zod";

const problemDetailsSchema = z.object({
	type: z.string(),
	title: z.string(),
	status: z.number(),
	detail: z.string(),
	instance: z.string(),
	errors: z.record(z.string(), z.string().array()).optional(),
});

export type ProblemDetails = z.infer<typeof problemDetailsSchema>;
export type HttpClientErrorResponse = AxiosError<ProblemDetails>;

export const DEFAULT_PROBLEM_DETAILS: ProblemDetails = {
	type: "about:blank",
	title: "An unexpected error occurred",
	status: HttpStatusCode.InternalServerError,
	detail:
		"The server responded with an invalid error format or there was a network issue.",
	instance: "client-side-fallback",
	errors: undefined,
};

export const errorInterceptor = async (error: HttpClientErrorResponse) => {
	const problemDetailsResult = await problemDetailsSchema.safeParseAsync(
		error.response?.data,
	);

	if (!problemDetailsResult.success) {
		if (error.response)
			error.response.data = {
				...DEFAULT_PROBLEM_DETAILS,
				status: error.response.status,
			};

		if (!error.response)
			error.response = {
				data: DEFAULT_PROBLEM_DETAILS,
				status: HttpStatusCode.InternalServerError,
				statusText: "Internal Server Error",
				headers: {},
				config: error.config as InternalAxiosRequestConfig,
			};
	}

	return Promise.reject(error);
};
