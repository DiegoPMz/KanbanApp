import AxiosMockAdapter from "axios-mock-adapter";
import { beforeEach, describe, expect, test } from "vitest";
import { httpClient } from "../api.client";
import {
	DEFAULT_PROBLEM_DETAILS,
	ProblemDetails,
} from "../http-error.interceptor";

const mock = new AxiosMockAdapter(httpClient);
mock.adapter();

describe("api:api-client --> httpClient", () => {
	beforeEach(() => {
		mock.reset();
	});

	test("should return default ProblemDetails when the API returns an error with an empty body", async () => {
		mock.onGet("/empty").reply(400, undefined);

		await expect(httpClient.get("/empty")).rejects.toMatchObject({
			response: {
				data: {
					...DEFAULT_PROBLEM_DETAILS,
					status: 400,
				},
			},
		});
	});

	test("should propagate the specific ProblemDetails returned by the API", async () => {
		const mockedProblemDetails: ProblemDetails = {
			type: "RFC3986",
			title: "Not found",
			status: 404,
			detail: "Resource not found",
			instance: "GET /not-found",
		};

		mock.onGet("/not-found").reply(404, mockedProblemDetails);

		await expect(httpClient.get("/not-found")).rejects.toMatchObject({
			response: {
				data: mockedProblemDetails,
			},
		});
	});

	test("should return generic ProblemDetails when a network error occurs", async () => {
		mock.onGet("/network-error").networkError();

		await expect(httpClient.get("/network-error")).rejects.toMatchObject({
			response: {
				data: DEFAULT_PROBLEM_DETAILS,
			},
		});
	});
});
