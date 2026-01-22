export interface ProblemDetails {
	type: string;
	title: string;
	status: number;
	detail: string;
	instance: string;
	errors?: Record<string, string[]>;
}

export const DEFAULT_PROBLEM_DETAILS: ProblemDetails = {
	type: "about:blank",
	title: "An unexpected error occurred",
	status: 500,
	detail:
		"The server responded with an invalid error format or there was a network issue.",
	instance: "client-side-fallback",
	errors: undefined,
};
