import {
	DEFAULT_PROBLEM_DETAILS,
	ProblemDetails,
} from "@/shared/domain/http/problem-details";
import { AxiosError, HttpStatusCode, InternalAxiosRequestConfig } from "axios";
import z from "zod";

const problemDetailsSchema: z.ZodType<ProblemDetails> = z.object({
	type: z.string(),
	title: z.string(),
	status: z.number(),
	detail: z.string(),
	instance: z.string(),
	errors: z.record(z.string(), z.string().array()).optional(),
});

export type HttpClientErrorResponse = AxiosError<ProblemDetails>;

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
