import { globalErrorCodes } from "@/shared/domain/errors/global.error";
import {
	DEFAULT_PROBLEM_DETAILS,
	ProblemDetails,
} from "@/shared/domain/http/problem-details";
import { errorTypes } from "@/shared/domain/result";
import { baseURL } from "@/shared/infra/http/http.client";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { UserModel } from "../domain/user.model";
import { apiUserRepository, UserApiDto } from "./user.repository.api";

const createBaseUser = (overrides?: Partial<UserModel>): UserModel => ({
	id: "random-mock-id",
	email: "test@gmail.com",
	sessionType: "BASE",
	theme: "Dark",
	...overrides,
});

const server = setupServer();

describe("features/user : apiUserRepository", () => {
	beforeAll(() => server.listen());
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());

	describe("getDetails()", () => {
		test(`should fail with '${errorTypes.Authentication}' when the api responds with 401`, async () => {
			server.use(
				http.get(`${baseURL}/user`, () => {
					return HttpResponse.json(
						{ ...DEFAULT_PROBLEM_DETAILS, status: 401 },
						{ status: 401 },
					);
				}),
			);

			const result = await apiUserRepository.getDetails();

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0]).toMatchObject({
				type: errorTypes.Authentication,
				code: globalErrorCodes.Authentication,
			});
		});

		test(`should fail with '${errorTypes.Internal}' when the api responds with 500`, async () => {
			server.use(
				http.get(`${baseURL}/user`, () => {
					return HttpResponse.json(
						{ ...DEFAULT_PROBLEM_DETAILS, status: 500 },
						{ status: 500 },
					);
				}),
			);

			const result = await apiUserRepository.getDetails();

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0]).toMatchObject({
				type: errorTypes.Internal,
				code: globalErrorCodes.Internal,
			});
		});

		test(`should fail with '${errorTypes.Internal}' and ${globalErrorCodes.Internal} when a physical network failure (no response) occurs`, async () => {
			server.use(http.get(`${baseURL}/user`, () => HttpResponse.error()));

			const result = await apiUserRepository.getDetails();

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0]).toMatchObject({
				code: globalErrorCodes.Internal,
				type: errorTypes.Internal,
			});
		});

		test(`should return the User-Base data when the api responds with 200`, async () => {
			const mockedResponse: UserApiDto = {
				id: "user-register-id",
				email: "register.user@gmail.com",
				theme: "Dark",
			};

			server.use(
				http.get(`${baseURL}/user`, () => {
					return HttpResponse.json(
						{ ...mockedResponse, status: 200 },
						{ status: 200 },
					);
				}),
			);

			const result = await apiUserRepository.getDetails();
			const resultUser: UserModel = { ...mockedResponse, sessionType: "BASE" };

			expect(result.isSuccess).toBe(true);
			expect(result.value).toEqual(resultUser);
		});
	});

	describe("update()", () => {
		test(`should fail with '${errorTypes.Authentication}' when the api responds with 401`, async () => {
			server.use(
				http.patch(`${baseURL}/user`, () => {
					return HttpResponse.json(
						{ ...DEFAULT_PROBLEM_DETAILS, status: 401 },
						{ status: 401 },
					);
				}),
			);

			const updateData = createBaseUser({
				theme: "Light",
			});

			const result = await apiUserRepository.update(updateData);

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0]).toMatchObject({
				type: errorTypes.Authentication,
				code: globalErrorCodes.Authentication,
			});
		});

		test(`should fail with '${errorTypes.Internal}' when the api responds with 500`, async () => {
			server.use(
				http.patch(`${baseURL}/user`, () => {
					return HttpResponse.json(
						{ ...DEFAULT_PROBLEM_DETAILS, status: 500 },
						{ status: 500 },
					);
				}),
			);
			const mockedUser = createBaseUser();

			const result = await apiUserRepository.update({
				...mockedUser,
				theme: "Light",
			});

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0]).toMatchObject({
				type: errorTypes.Internal,
				code: globalErrorCodes.Internal,
			});
		});

		test(`should send the correct payload to the server`, async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			let capturedBody: any = null;
			const mockedUser = createBaseUser();

			server.use(
				http.patch<UserApiDto>(`${baseURL}/user`, async ({ request }) => {
					capturedBody = await request.clone().json();
					return HttpResponse.json(
						{ ...mockedUser, theme: capturedBody?.theme },
						{ status: 200 },
					);
				}),
			);

			const updateData: UserModel = { ...mockedUser, theme: "Light" };
			const result = await apiUserRepository.update(updateData);

			expect(capturedBody).toMatchObject({ theme: updateData.theme });

			expect(result.isSuccess).toBe(true);
			expect(result.value).toMatchObject({ theme: "Light" });
		});

		test("should return a validation error when the server rejects the payload", async () => {
			server.use(
				http.patch(`${baseURL}/user`, () => {
					return HttpResponse.json(
						{
							...DEFAULT_PROBLEM_DETAILS,
							status: 400,
							title: "Bad Request",
							detail: "Invalid theme value",
							errors: { theme: ["Invalid theme value"] },
						} as ProblemDetails,
						{ status: 400 },
					);
				}),
			);
			const updateData = createBaseUser({
				theme: "Invalid Theme" as UserModel["theme"],
			});

			const result = await apiUserRepository.update(updateData);

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0].type).toBe(errorTypes.Validation);
		});

		test(`should fail with '${errorTypes.Internal}' and ${globalErrorCodes.Internal} when a physical network failure (no response) occurs`, async () => {
			server.use(http.patch(`${baseURL}/user`, () => HttpResponse.error()));
			const mockedUser = createBaseUser();

			const result = await apiUserRepository.update({
				...mockedUser,
				theme: "Light",
			});

			expect(result.isSuccess).toBe(false);
			expect(result.value).toBeNull();

			expect(result.errors[0]).toMatchObject({
				code: globalErrorCodes.Internal,
				type: errorTypes.Internal,
			});
		});
	});
});
