import { globalErrorCodes } from "@/shared/domain/errors/global.error";
import { DEFAULT_PROBLEM_DETAILS } from "@/shared/domain/http/problem-details";
import { errorTypes } from "@/shared/domain/result";
import { baseURL } from "@/shared/infra/http/http.client";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { BoardFullDetailsModel } from "../domain/board.board-full-details.read-model";
import { boardErrorCodes } from "../domain/board.errors";
import { BoardModel } from "../domain/board.model";
import {
	apiBoardRepository,
	BoardApiDto,
	BoardFullDetailsDTO,
	mapHttpBoardErrorToResult,
} from "./board.repository.api";
import { HttpClientErrorResponse } from "@/shared/infra/http/axios-error.interceptor";
import { PaginatedResponse } from "@/shared/domain/paginated-response.read-model";
import { Pagination } from "@/shared/domain/pagination.value-object";

const server = setupServer();

describe("features/board : apiBoardRepository", () => {
	beforeAll(() => server.listen());
	afterEach(() => server.resetHandlers());
	afterAll(() => server.close());

	describe("create()", () => {
		test(`should successfully create a board and map the response correctly`, async () => {
			const board = createBoard();

			server.use(
				http.post(`${baseURL}/boards`, () => {
					return HttpResponse.json(
						{ name: board.name, id: generateId() },
						{ status: 200 },
					);
				}),
			);

			const result = await apiBoardRepository.create(board);

			expect(result.isSuccess).toBe(true);
			expect(result.value).toMatchObject({
				name: board.name,
				columnIds: [],
			});
		});
	});

	describe("update()", () => {
		test("should ensure the correct JSON payload is sent in the PATCH request", async () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			let capturedBody: any = null;
			const initialBoard = createBoard({
				name: "Original Name",
				columnIds: ["col-1"],
			});

			server.use(
				http.patch(
					`${baseURL}/boards/${initialBoard.id}`,
					async ({ request }) => {
						capturedBody = await request.json();
						return HttpResponse.json(
							{ ...initialBoard, name: capturedBody.name },
							{ status: 200 },
						);
					},
				),
			);

			const updatedData = { ...initialBoard, name: "Updated Name" };
			await apiBoardRepository.update(updatedData);

			expect(capturedBody).toEqual({ name: "Updated Name" });
		});

		test(`should return a Not Found error when the board ID is missing or invalid on the server`, async () => {
			const nonExistentBoard = createBoard();

			server.use(
				http.patch(`${baseURL}/boards/${nonExistentBoard.id}`, () => {
					return HttpResponse.json(
						{ ...DEFAULT_PROBLEM_DETAILS, status: 404 },
						{ status: 404 },
					);
				}),
			);

			const result = await apiBoardRepository.update(nonExistentBoard);

			expect(result.errors[0]).toMatchObject({
				type: errorTypes.Not_found,
				code: boardErrorCodes.NotFound,
			});
		});
	});

	describe("delete()", () => {
		test("should complete the deletion successfully when receiving a 204 No Content response", async () => {
			const boardToDelete = createBoard({ name: "Delete Me" });

			server.use(
				http.delete(`${baseURL}/boards/${boardToDelete.id}`, () => {
					return new HttpResponse(null, { status: 204 });
				}),
			);

			const result = await apiBoardRepository.delete(boardToDelete);

			expect(result.isSuccess).toBe(true);
			expect(result.value).toBeTypeOf("string");
		});

		test(`should return a Not Found error if the deletion target does not exist`, async () => {
			const ghostBoard = createBoard({ id: "ghost-id" });

			server.use(
				http.delete(`${baseURL}/boards/${ghostBoard.id}`, () => {
					return HttpResponse.json(
						{ ...DEFAULT_PROBLEM_DETAILS, status: 404 },
						{ status: 404 },
					);
				}),
			);

			const result = await apiBoardRepository.delete(ghostBoard);

			expect(result.errors[0]).toMatchObject({
				code: boardErrorCodes.NotFound,
				type: errorTypes.Not_found,
			});
		});
	});

	describe("getBoardDetails()", () => {
		test("should return a fully mapped BoardFullDetailsModel from a nested DTO response", async () => {
			const { boardToFind, boardDetails, expectedResult } =
				setupBoardDetailsMock();

			server.use(
				http.get(`${baseURL}/boards/${boardToFind.id}/full-details`, () => {
					return HttpResponse.json(boardDetails, { status: 200 });
				}),
			);

			const result = await apiBoardRepository.getBoardDetails(boardToFind.id);

			expect(result.isSuccess).toBe(true);
			expect(result.value).toEqual(expectedResult);
		});
	});

	describe("search()", () => {
		test("should include cursor and limit in the query string", async () => {
			let capturedUrl: URL | null = null;

			server.use(
				http.get(`${baseURL}/boards`, ({ request }) => {
					capturedUrl = new URL(request.url);

					const response: PaginatedResponse<BoardApiDto> = {
						items: [],
						nextCursor: "any",
						hasNextPage: false,
					};
					return HttpResponse.json(response);
				}),
			);

			const limit = 8;
			const cursor = "mock-cursor";
			const mockPagination = Pagination.create(limit, cursor);

			await apiBoardRepository.search(mockPagination.value);

			expect((capturedUrl as unknown as URL)?.searchParams.get("cursor")).toBe(
				cursor,
			);
			expect((capturedUrl as unknown as URL)?.searchParams.get("limit")).toBe(
				limit.toString(),
			);
		});

		test("should not include cursor in the query string when it is not provided (First Page)", async () => {
			let capturedUrl: URL | null = null;

			server.use(
				http.get(`${baseURL}/boards`, ({ request }) => {
					capturedUrl = new URL(request.url);

					// Retornamos una respuesta estándar
					return HttpResponse.json({
						items: [],
						nextCursor: "some-cursor",
						hasNextPage: true,
					});
				}),
			);

			const limit = 10;
			const mockPagination = Pagination.create(limit);

			await apiBoardRepository.search(mockPagination.value);

			expect(capturedUrl).not.toBeNull();
			expect((capturedUrl as unknown as URL)?.searchParams.get("limit")).toBe(
				limit.toString(),
			);
			expect((capturedUrl as unknown as URL)?.searchParams.has("cursor")).toBe(
				false,
			);
		});

		test("should correctly map the API response to the domain result", async () => {
			const apiResponse: PaginatedResponse<BoardApiDto> = {
				items: [1, 2, 3, 4, 5].map((i) => ({
					id: generateId(),
					name: `Mock-board #${i}`,
				})),
				nextCursor: "new-cursor-responded",
				hasNextPage: true,
			};

			server.use(
				http.get(`${baseURL}/boards`, () => {
					return HttpResponse.json(apiResponse);
				}),
			);

			const mockPagination = Pagination.create(5);
			const res = await apiBoardRepository.search(mockPagination.value);

			expect(res.isSuccess).toBe(true);

			expect(res.value.hasNextPage).toBe(true);
			expect(res.value.nextCursor).toBe("new-cursor-responded");
			expect(res.value.items).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						id: expect.any(String),
						name: expect.any(String),
						columnIds: expect.any(Array),
					}),
				]),
			);
		});
	});

	describe("apiBoardRepository : mapToDomainError", () => {
		test("should map 400 Bad Request to Validation error type if the problemDetails has the errors property", () => {
			const mockError = {
				isAxiosError: true,
				response: {
					status: 400,
					data: {
						...DEFAULT_PROBLEM_DETAILS,
						errors: { name: ["The name is too long."] },
						status: 400,
					},
				},
			} as unknown as HttpClientErrorResponse;

			const mockBoard = createBoard();

			const result = mapHttpBoardErrorToResult(mockError, mockBoard);

			expect(result.errors[0].type).toBe(errorTypes.Validation);
		});

		test("should map 400 Bad Request to global error type if problemDetails does not have the errors property", () => {
			const mockError = {
				isAxiosError: true,
				response: {
					status: 400,
					data: {
						...DEFAULT_PROBLEM_DETAILS,
						status: 400,
					},
				},
			} as unknown as HttpClientErrorResponse;

			const mockBoard = createBoard();

			const result = mapHttpBoardErrorToResult(mockError, mockBoard);

			expect(result.errors[0]).toMatchObject({
				type: errorTypes.Internal,
				code: globalErrorCodes.Internal,
			});
		});

		test("should map 401 Unauthorized to Authentication error type", () => {
			const mockError = {
				isAxiosError: true,
				response: {
					status: 401,
					data: { ...DEFAULT_PROBLEM_DETAILS, status: 401 },
				},
			} as HttpClientErrorResponse;

			const mockBoard = createBoard();

			const result = mapHttpBoardErrorToResult(mockError, mockBoard);

			expect(result.errors[0]).toMatchObject({
				type: errorTypes.Authentication,
				code: globalErrorCodes.Authentication,
			});
		});

		test("should map 404 Not Found to Not_found error type", () => {
			const mockError = {
				isAxiosError: true,
				response: {
					status: 404,
					data: { ...DEFAULT_PROBLEM_DETAILS, status: 404 },
				},
			} as HttpClientErrorResponse;

			const mockBoard = createBoard();

			const result = mapHttpBoardErrorToResult(mockError, mockBoard);

			expect(result.errors[0]).toMatchObject({
				type: errorTypes.Not_found,
				code: boardErrorCodes.NotFound,
			});
		});

		test("should map 500 Internal Server Error to Internal error type", () => {
			const mockError = {
				isAxiosError: true,
				response: {
					status: 500,
					data: { ...DEFAULT_PROBLEM_DETAILS, status: 500 },
				},
			} as HttpClientErrorResponse;

			const mockBoard = createBoard();
			const result = mapHttpBoardErrorToResult(mockError, mockBoard);

			expect(result.errors[0]).toMatchObject({
				type: errorTypes.Internal,
				code: globalErrorCodes.Internal,
			});
		});
	});
});

const generateId = () => crypto.randomUUID();

const createBoard = (overrides?: Partial<BoardModel>): BoardModel => ({
	id: generateId(), // Must be an UUID
	name: "Board for testing",
	columnIds: [],
	...overrides,
});

const setupBoardDetailsMock = () => {
	const boardId = "board-123";
	const columnId = "col-456";
	const taskId = "task-789";

	const boardToFind: BoardModel = {
		id: boardId,
		name: "Project Alpha",
		columnIds: [columnId, "col-457"],
	};

	const boardDetails: BoardFullDetailsDTO = {
		id: boardId,
		name: "Project Alpha",
		columns: [
			{
				id: columnId,
				boardId: boardId,
				name: "To Do",
				color: "#4951F1",
				position: 0,
				boardTasks: [
					{
						id: taskId,
						columnId: columnId,
						title: "Setup Repository",
						description: "Initialize git and basic folder structure",
						isCompleted: false,
						position: 0,
						priority: "high",
						subTasks: [
							{
								id: "sub-1",
								boardTaskId: taskId,
								description: "Install Jest",
								isCompleted: true, // Una completada
							},
							{
								id: "sub-2",
								boardTaskId: taskId,
								description: "Configure ESLint",
								isCompleted: false, // Una pendiente
							},
							{
								id: "sub-3",
								boardTaskId: taskId,
								description: "Setup Husky hooks",
								isCompleted: false,
							},
						],
					},
				],
			},
			{
				id: "col-457",
				boardId: boardId,
				name: "Done",
				color: "#67E2AE",
				position: 1,
				boardTasks: [],
			},
		],
	};

	const expectedResult: BoardFullDetailsModel = {
		board: boardToFind,

		columns: [
			{
				id: columnId,
				boardId: boardId,
				name: "To Do",
				color: "#4951F1",
				position: 0,
				taskIds: [taskId],
			},
			{
				id: "col-457",
				boardId: boardId,
				name: "Done",
				color: "#67E2AE",
				position: 1,
				taskIds: [],
			},
		],

		tasks: [
			{
				id: taskId,
				columnId: columnId,
				title: "Setup Repository",
				description: "Initialize git and basic folder structure",
				isCompleted: false,
				position: 0,
				priority: "high",
				subTaskIds: ["sub-1", "sub-2", "sub-3"],
			},
		],

		subTasks: [
			{
				id: "sub-1",
				taskId: taskId,
				description: "Install Jest",
				isCompleted: true,
			},
			{
				id: "sub-2",
				taskId: taskId,
				description: "Configure ESLint",
				isCompleted: false,
			},
			{
				id: "sub-3",
				taskId: taskId,
				description: "Setup Husky hooks",
				isCompleted: false,
			},
		],
	};

	return { boardToFind, boardDetails, expectedResult };
};
