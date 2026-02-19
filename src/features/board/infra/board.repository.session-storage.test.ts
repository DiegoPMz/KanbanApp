import { ColumnModel } from "@/features/column";
import { SubTaskModel } from "@/features/subTask";
import { TaskModel } from "@/features/task";
import { Pagination } from "@/shared/domain/pagination.value-object";
import { errorTypes } from "@/shared/domain/result";
import { sessionDb } from "@/shared/infra/persistence/session-storage.db";
import { BoardFullDetailsModel } from "../domain/board.board-full-details.read-model";
import { boardErrorCodes } from "../domain/board.errors";
import { BoardModel } from "../domain/board.model";
import {
	encodeCursor,
	sessionStorageBoardRepository,
} from "./board.repository.session-storage";

describe("features/board : sessionStorageBoardRepository", () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	describe("create()", () => {
		test(`should fail with '${boardErrorCodes.StorageCorrupted}' when persisted data violates domain rules`, async () => {
			const board = createBoard();
			const corruptedData = [
				{
					id: 1,
				},
				{
					id: "user-002",
					name: null,
					columnIds: "id-1",
				},
				{
					id: "user-003",
					name: "Developer",
					columnIds: [101, "col-2", true],
				},
				{},
				{
					uuid: "user-005",
					full_name: "Error User",
				},
			] as BoardModel[];

			sessionDb.boards.save(corruptedData);

			const result = await sessionStorageBoardRepository.create(board);

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0]).toMatchObject({
				type: errorTypes.Internal,
				code: boardErrorCodes.StorageCorrupted,
			});
		});

		test(`If the persistence data is null or empty should save the board without problems`, async () => {
			const board = createBoard();

			expect(sessionDb.boards.get()).toBeNull();

			const result = await sessionStorageBoardRepository.create(board);

			expect(result.isSuccess).toBe(true);
			expect(result.value).toMatchObject({
				name: board.name,
				columnIds: board.columnIds,
			});

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const store = sessionDb.boards.get()!;
			expect(store[0]).toEqual(result.value);
		});

		test("should assign a new ID when creating a board", async () => {
			const board = createBoard({ id: "board-1" }); // The id will be replaced

			const result = await sessionStorageBoardRepository.create(board);

			expect(result.isSuccess).toBe(true);

			expect(result.value.id).toBeDefined();
			expect(typeof result.value.id).toBe("string");
			expect(result.value.id.length).toBeGreaterThan(0);
			expect(result.value.id).not.toBe(board.id);

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const store = sessionDb.boards.get()!;
			expect(store[0].id).toBe(result.value.id);
		});

		test("should append the new board to existing valid data without affecting them", async () => {
			const initialBoard = createBoard();
			sessionDb.boards.save([initialBoard]);

			const newBoard = createBoard({ id: "b2", name: "New" });

			const result = await sessionStorageBoardRepository.create(newBoard);

			expect(result.isSuccess).toBe(true);
			const storedBoards = sessionDb.boards.get();
			expect(storedBoards).toHaveLength(2);
			expect(storedBoards).toContainEqual(initialBoard);
			expect((storedBoards ?? [])[1]).toMatchObject({
				name: newBoard.name,
				columnIds: [],
			});
		});
	});

	describe("update()", () => {
		test("should successfully update an existing board and return the updated data", async () => {
			const initialBoardId = generateId();
			const initialBoard = createBoard({
				id: initialBoardId,
				name: "Original Name",
			});
			sessionDb.boards.save([initialBoard]);

			const updatedData = { ...initialBoard, name: "Updated Name" };
			const result = await sessionStorageBoardRepository.update(updatedData);

			expect(result.isSuccess).toBe(true);
			expect(result.value).toEqual(updatedData);

			const stored = sessionDb.boards.get();
			expect(stored?.find((b) => b.id === initialBoardId)?.name).toBe(
				"Updated Name",
			);
		});

		test(`should fail with '${boardErrorCodes.NotFound}' when the board id does not exist`, async () => {
			sessionDb.boards.save([]);
			const nonExistentBoardId = crypto.randomUUID();
			const nonExistentBoard = createBoard({
				id: nonExistentBoardId,
				name: "Ghost",
			});

			const result =
				await sessionStorageBoardRepository.update(nonExistentBoard);

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0]).toMatchObject({
				type: errorTypes.Not_found,
				code: boardErrorCodes.NotFound,
			});
		});

		test("should not affect other boards in the storage when updating one", async () => {
			const board1 = createBoard({ id: generateId(), name: "Keep Me" });
			const board2 = createBoard({ id: generateId(), name: "Update Me" });
			sessionDb.boards.save([board1, board2]);

			const updateForBoard2: BoardModel = { ...board2, name: "New Name 2" };
			await sessionStorageBoardRepository.update(updateForBoard2);

			const stored = sessionDb.boards.get();
			const board1Persisted = stored?.find((b) => b.id === board1.id);
			expect(board1Persisted?.name).toBe("Keep Me");

			const board2Persisted = stored?.find((b) => b.id === board2.id);
			expect(board2Persisted?.name).toBe("New Name 2");
		});
	});

	describe("delete()", () => {
		test("should successfully delete a board and return its id", async () => {
			const boardToDelete = createBoard({ name: "Delete Me" });
			sessionDb.boards.save([boardToDelete]);

			const result = await sessionStorageBoardRepository.delete(boardToDelete);

			expect(result.isSuccess).toBe(true);
			expect(result.value).toBeTypeOf("string");

			const stored = sessionDb.boards.get();
			const found = stored?.find((b) => b.id === boardToDelete.id);
			expect(found).toBeUndefined();
		});

		test(`should fail with '${boardErrorCodes.NotFound}' when trying to delete a non-existent board`, async () => {
			sessionDb.boards.save([]);
			const ghostBoard = createBoard({ id: "ghost-id" });

			const result = await sessionStorageBoardRepository.delete(ghostBoard);

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0]).toMatchObject({
				code: boardErrorCodes.NotFound,
				type: errorTypes.Not_found,
			});
		});

		test("should only delete the specified board and keep others", async () => {
			const boardToKeep = createBoard({ name: "I Stay" });
			const boardToRemove = createBoard({ name: "I Go" });
			sessionDb.boards.save([boardToKeep, boardToRemove]);

			await sessionStorageBoardRepository.delete(boardToRemove);

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const stored = sessionDb.boards.get()!;
			expect(stored).toHaveLength(1);
			expect(stored[0].id).toBe(boardToKeep.id);
			expect(stored.find((b) => b.id === boardToRemove.id)).toBeUndefined();
		});
	});

	describe("search()", () => {
		test("should return the first page of boards and the correct nextCursor", async () => {
			const boards = [
				createBoard({ name: "board-1" }),
				createBoard({ name: "board-2" }), // This should be the last one with the limit=2
				createBoard({ name: "board-3" }),
				createBoard({ name: "board-4" }),
			];
			sessionDb.boards.save(boards);

			const limit = 2;
			const mockPagination = Pagination.create(limit);
			const lastItemOnPage = boards[1];

			const res = await sessionStorageBoardRepository.search(
				mockPagination.value,
			);

			expect(res.isSuccess).toBe(true);
			expect(res.value.items).toHaveLength(limit);
			expect(res.value.items[1].id).toBe(lastItemOnPage.id);

			// Verify that the cursor is actually pointing to the last delivered element.
			expect(res.value.nextCursor).toBe(encodeCursor(lastItemOnPage.id));
			expect(res.value.hasNextPage).toBe(true);
		});

		test("should return remaining items when cursor points to the middle of the collection", async () => {
			const referenceId = generateId();
			sessionDb.boards.save([
				createBoard({ name: "b1" }),
				createBoard({ name: "b2" }),
				createBoard({ name: "b3" }),
				createBoard({ name: "b4", id: referenceId }),
				createBoard({ name: "b5" }),
				createBoard({ name: "b6" }),
			]);

			const baseCursor = encodeCursor(referenceId);
			const limit = 4;
			const mockPagination = Pagination.create(limit, baseCursor);

			const res = await sessionStorageBoardRepository.search(
				mockPagination.value,
			);

			expect(res.isSuccess).toBe(true);
			expect(res.value.items).toHaveLength(2); // b5 y b6
			expect(res.value.items.map((b) => b.name)).toEqual(["b5", "b6"]);

			expect(res.value).toMatchObject({
				nextCursor: null,
				hasNextPage: false,
			});
		});

		test("should return an empty result when the cursor points to the very last item", async () => {
			const lastId = generateId();
			sessionDb.boards.save([
				createBoard({ name: "b1" }),
				createBoard({ name: "b2", id: lastId }),
			]);

			const mockPagination = Pagination.create(2, encodeCursor(lastId));
			const res = await sessionStorageBoardRepository.search(
				mockPagination.value,
			);

			expect(res.isSuccess).toBe(true);
			expect(res.value.items).toHaveLength(0);
			expect(res.value.hasNextPage).toBe(false);
			expect(res.value.nextCursor).toBeNull();
		});
	});

	describe("getBoardDetails()", () => {
		test("should successfully return the boardFullDetailsModel data", async () => {
			const { board, expectedDetails } = setupBoardDetailsMock();

			sessionDb.boards.save([board]);
			sessionDb.columns.save(expectedDetails.columns);
			sessionDb.tasks.save(expectedDetails.tasks);
			sessionDb.subtasks.save(expectedDetails.subTasks);

			const result = await sessionStorageBoardRepository.getBoardDetails(
				board.id,
			);

			expect(result.isSuccess).toBe(true);
			expect(result.value).toEqual(expectedDetails);

			expect(result.value.columns).toContainEqual(expectedDetails.columns[0]);
			expect(result.value.columns).toHaveLength(expectedDetails.columns.length);

			expect(result.value.tasks).toContainEqual(expectedDetails.tasks[0]);
			expect(result.value.tasks).toHaveLength(expectedDetails.tasks.length);

			expect(result.value.subTasks).toContainEqual(expectedDetails.subTasks[0]);
			expect(result.value.subTasks).toHaveLength(
				expectedDetails.subTasks.length,
			);
		});

		test("should return board details with empty relations when relation tables do not exist in storage", async () => {
			const boardPersisted = createBoard();
			sessionDb.boards.save([boardPersisted]);

			const expectedDetails: BoardFullDetailsModel = {
				board: boardPersisted,
				columns: [],
				tasks: [],
				subTasks: [],
			};

			const result = await sessionStorageBoardRepository.getBoardDetails(
				boardPersisted.id,
			);

			expect(result.isSuccess).toBe(true);
			expect(result.value).toEqual(expectedDetails);

			expect(result.value.columns).toEqual([]);
			expect(result.value.tasks).toEqual([]);
			expect(result.value.subTasks).toEqual([]);
		});

		test(`should fail with '${boardErrorCodes.NotFound}' if the board id does not exist`, async () => {
			sessionDb.boards.save([]);

			const result =
				await sessionStorageBoardRepository.getBoardDetails("non-existent-id");

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0]).toMatchObject({
				code: boardErrorCodes.NotFound,
				type: errorTypes.Not_found,
			});
		});

		test(`should fail with '${boardErrorCodes.NotFound}' if the board persistence does not exist`, async () => {
			const result =
				await sessionStorageBoardRepository.getBoardDetails("non-existent-id");

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0]).toMatchObject({
				code: boardErrorCodes.NotFound,
				type: errorTypes.Not_found,
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
	const boardId = generateId();
	const columnId = generateId();
	const taskId = generateId();
	const subTaskId = generateId();

	const board = createBoard({
		id: boardId,
		name: "Project Alpha",
		columnIds: [columnId],
	});

	const columns: ColumnModel[] = [
		{
			id: columnId,
			boardId: boardId,
			name: "To Do",
			color: "#fff",
			position: 0,
			taskIds: [taskId],
		},
	];

	const tasks: TaskModel[] = [
		{
			id: taskId,
			columnId: columnId,
			title: "Setup Repository",
			description: "",
			isCompleted: false,
			position: 0,
			priority: "high",
			subTaskIds: [subTaskId],
		},
	];

	const subTasks: SubTaskModel[] = [
		{
			id: subTaskId,
			taskId: taskId,
			description: "Install Jest",
			isCompleted: false,
		},
	];

	const expectedDetails: BoardFullDetailsModel = {
		board,
		columns,
		tasks,
		subTasks,
	};

	return { board, expectedDetails };
};
