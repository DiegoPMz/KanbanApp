import {
	DEFAULT_PROBLEM_DETAILS,
	ProblemDetails,
} from "@/shared/domain/http/problem-details";
import { http, HttpResponse } from "msw";
import { SetupServerApi } from "msw/node";
import { httpClient } from "./http.client";

const server = new SetupServerApi([]);

describe("api:api-client --> httpClient (con MSW)", () => {
	beforeAll(() => server.listen());
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());

	test("should return default ProblemDetails when the API returns an error with an empty body", async () => {
		server.use(
			http.get("*/empty", () => {
				return new HttpResponse(null, { status: 400 });
			}),
		);

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

		server.use(
			http.get("*/not-found", () => {
				return HttpResponse.json(mockedProblemDetails, { status: 404 });
			}),
		);

		await expect(httpClient.get("/not-found")).rejects.toMatchObject({
			response: {
				data: mockedProblemDetails,
			},
		});
	});

	test("should return generic ProblemDetails when a network error occurs", async () => {
		server.use(
			http.get("*/network-error", () => {
				return HttpResponse.error();
			}),
		);

		await expect(httpClient.get("/network-error")).rejects.toMatchObject({
			response: {
				data: DEFAULT_PROBLEM_DETAILS,
			},
		});
	});
});
