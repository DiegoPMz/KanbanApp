import { ColumnModel } from "@/features/column";
import { SubTaskModel } from "@/features/subTask";
import { TaskModel } from "@/features/task";
import { PaginatedResponse } from "@/shared/domain/paginated-response.read-model";
import { Pagination } from "@/shared/domain/pagination.value-object";
import { Result } from "@/shared/domain/result";
import {
	sessionDb,
	sessionDbKeys,
} from "@/shared/infra/persistence/session-storage.db";
import z from "zod";
import { BoardFullDetailsModel } from "../domain/board.board-full-details.read-model";
import { Board, BoardModel } from "../domain/board.model";
import { IBoardRepository } from "../domain/board.repository";
import {
	boardErrorCodes,
	boardRepositoryErrors,
} from "./../domain/board.errors";

export const sessionStorageBoardRepository: IBoardRepository = {
	search: async (
		pagination: Pagination,
	): Promise<Result<PaginatedResponse<BoardModel>>> => {
		const { value: boards, isSuccess, errors } = await loadPersistedBoards();

		if (!isSuccess)
			return errors[0].code === boardErrorCodes.DataNotPersisted
				? Result.Success({
						items: [],
						hasNextPage: false,
						nextCursor: null,
					})
				: Result.Failure(errors);

		if (pagination.cursor === undefined) {
			const items = boards.slice(0, pagination.limit);
			const lastItem = items[items.length - 1];
			const hasNextPage = boards.length > pagination.limit;

			const nextCursor =
				lastItem && hasNextPage ? encodeCursor(lastItem.id) : null;

			return Result.Success({
				items,
				nextCursor,
				hasNextPage,
			});
		}

		const cursorValue = decodeCursor(pagination.cursor);
		const itemIndex = boards.findIndex((b) => b.id === cursorValue);

		if (itemIndex === -1) return Result.Failure([]);

		const start = itemIndex + 1;
		const end = start + pagination.limit;
		const items = boards.slice(start, end);

		const lastItem = items[items.length - 1];
		const hasNextPage = boards.length > end;

		const nextCursor =
			lastItem && hasNextPage ? encodeCursor(lastItem.id) : null;

		return Result.Success({
			items,
			nextCursor,
			hasNextPage,
		});
	},

	getBoardDetails: async (
		id: string,
	): Promise<Result<BoardFullDetailsModel>> => {
		const { value, isSuccess, errors } = await loadPersistedBoards();
		if (!isSuccess)
			return errors[0].code === boardErrorCodes.DataNotPersisted
				? Result.Failure([boardRepositoryErrors.notFound(id)])
				: Result.Failure(errors);

		const boardIndex = value.findIndex((board) => board.id === board.id);

		if (boardIndex === -1)
			return Result.Failure([boardRepositoryErrors.notFound(id)]);

		const columnsPersisted = sessionDb.columns.get();
		const tasksPersisted = sessionDb.tasks.get();
		const subTasksPersisted = sessionDb.subtasks.get();

		const columns: ColumnModel[] = columnsPersisted
			? columnsPersisted.filter((c) => c.boardId === id)
			: [];
		const tasks: TaskModel[] = [];
		const subTasks: SubTaskModel[] = [];

		if (!columnsPersisted || !tasksPersisted)
			return Result.Success({
				board: value[boardIndex],
				columns,
				tasks,
				subTasks,
			});

		columns.forEach((col) => {
			col.taskIds.forEach((taskId) => {
				const taskFounded = tasksPersisted.find((t) => t.id === taskId);
				if (!taskFounded) return;

				tasks.push(taskFounded);
				if (!subTasksPersisted) return;

				taskFounded.subTaskIds.forEach((subtaskId) => {
					const subTaskFounded = subTasksPersisted.find(
						(st) => st.id === subtaskId,
					);

					if (subTaskFounded) subTasks.push(subTaskFounded);
				});
			});
		});

		return Result.Success({
			board: value[boardIndex],
			columns,
			tasks,
			subTasks,
		});
	},

	findById: async (boardId: BoardModel["id"]): Promise<Result<BoardModel>> => {
		const { isSuccess, value, errors } = await loadPersistedBoards();
		if (!isSuccess) return Result.Failure(errors);

		const boardFounded = value.find((b) => b.id === boardId);
		return boardFounded
			? Result.Success(boardFounded)
			: Result.Failure([boardRepositoryErrors.notFound(boardId)]);
	},

	create: async (data: BoardModel): Promise<Result<BoardModel>> => {
		const { isSuccess, value, errors } = await loadPersistedBoards();
		if (!isSuccess) {
			if (errors[0].code !== boardErrorCodes.DataNotPersisted)
				return Result.Failure(errors);
		}

		const boardToPersist = Board({ ...data, id: crypto.randomUUID() });

		sessionDb.boards.save([...(isSuccess ? value : []), boardToPersist.value]);
		return Result.Success(boardToPersist.value);
	},

	update: async (data: BoardModel): Promise<Result<BoardModel>> => {
		const { isSuccess, value, errors } = await loadPersistedBoards();
		if (!isSuccess) return Result.Failure(errors);

		const boardFoundedIndex = value.findIndex((b) => b.id === data.id);
		if (boardFoundedIndex === -1)
			return Result.Failure([boardRepositoryErrors.notFound(data.id)]);

		value[boardFoundedIndex] = data;
		sessionDb.boards.save(value);

		return Result.Success(data);
	},

	delete: async (data: BoardModel): Promise<Result<string>> => {
		const { isSuccess, value, errors } = await loadPersistedBoards();
		if (!isSuccess) return Result.Failure(errors);

		const foundedBoard = value.find((b) => b.id === data.id);
		if (!foundedBoard)
			return Result.Failure([boardRepositoryErrors.notFound(data.id)]);

		const updatedBoards = value.filter((b) => b.id !== foundedBoard.id);
		sessionDb.boards.save(updatedBoards);

		return Result.Success("Board deleted successfully");
	},
};

const boardListSessionStorageSchema: z.ZodType<BoardModel[]> = z.array(
	z.object({
		id: z.uuid(),
		name: z.string(),
		columnIds: z.array(z.string()),
	}),
);

const loadPersistedBoards = async (): Promise<Result<BoardModel[]>> => {
	const boardsPersisted = sessionDb.boards.get();

	if (!boardsPersisted)
		return Result.Failure([
			boardRepositoryErrors.dataNotFound(
				sessionDbKeys.boards,
				"SESSION_STORAGE",
			),
		]);

	const validation =
		await boardListSessionStorageSchema.safeParseAsync(boardsPersisted);

	if (!validation.success) {
		sessionDb.boards.clear();

		return Result.Failure([
			boardRepositoryErrors.corruptedData(
				sessionDbKeys.boards,
				"SESSION_STORAGE",
			),
		]);
	}

	return Result.Success(validation.data);
};

export function encodeCursor(id: string): string {
	return btoa(id); // string to Base64
}

export function decodeCursor(cursor: string): string {
	return atob(cursor); // base64 to String
}
