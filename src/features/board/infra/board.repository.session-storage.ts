import { ColumnModel, loadPersistedColumns } from "@/features/column";
import { SubTaskModel } from "@/features/subTask";
import { loadPersistedTasks, TaskModel } from "@/features/task";
import { Result } from "@/shared/domain/result";
import { safeJsonParse } from "@/shared/infra/utils/json.utils";
import z from "zod";
import { BoardFullDetailsModel } from "../domain/board.board-full-details.model";
import { Board, BoardModel } from "../domain/board.model";
import { IBoardRepository } from "../domain/board.repository";
import { boardRepositoryErrors } from "./../domain/board.errors";

const BOARD_STORAGE_KEY = "DEMO_KANBAN_BOARDS";

export const sessionStorageBoardRepository: IBoardRepository = {
	// TODO: implement proper pagination
	findPaginated: async (page: number, limit: number) => {
		const currentBoards = await loadPersistedBoards();
		if (!currentBoards.isSuccess) return Result.Error([]);

		// ❌
		return Result.Success([]);
	},

	getBoardDetails: async (id: string) => {
		const currentBoards = await loadPersistedBoards();
		if (!currentBoards.isSuccess) return Result.Error(currentBoards.errors);

		const foundedBoard = currentBoards.value.find((b) => b.id === id);
		if (!foundedBoard)
			return Result.Error<BoardFullDetailsModel>([
				boardRepositoryErrors.notFound(id),
			]);

		const currentColumns = await loadPersistedColumns();
		const currentTask = await loadPersistedTasks();
		// ❌
		const currentSubTasks = {} as Result<SubTaskModel[]>;

		if (
			!currentColumns.isSuccess ||
			!currentTask.isSuccess ||
			!currentSubTasks.isSuccess
		)
			return Result.Success<BoardFullDetailsModel>({
				columns: [],
				subTasks: [],
				tasks: [],
			});

		const columns: ColumnModel[] = currentColumns.value.filter(
			(c) => c.boardId === id,
		);
		const tasks: TaskModel[] = [];
		const subTasks: SubTaskModel[] = [];

		columns.forEach((col) => {
			col.taskIds.forEach((taskId) => {
				const taskFounded = currentTask.value.find(
					(task) => task.id === taskId,
				);
				if (!taskFounded) return;

				tasks.push(taskFounded);
				taskFounded.subtaskIds.forEach((subTaskId) => {
					const subTaskFounded = currentSubTasks.value.find(
						(subTask) => subTask.id === subTaskId,
					);
					if (!subTaskFounded) return;
					subTasks.push(subTaskFounded);
				});
			});
		});

		return Result.Success<BoardFullDetailsModel>({ columns, tasks, subTasks });
	},

	findById: async (boardId: BoardModel["id"]): Promise<Result<BoardModel>> => {
		const currentBoards = await loadPersistedBoards();
		if (!currentBoards.isSuccess) return Result.Error(currentBoards.errors);

		const foundedBoard = currentBoards.value.find((b) => b.id === boardId);
		return foundedBoard
			? Result.Success(foundedBoard)
			: Result.Error<BoardModel>([boardRepositoryErrors.notFound(boardId)]);
	},

	create: async (data: BoardModel) => {
		const currentBoards = await loadPersistedBoards();
		if (!currentBoards.isSuccess) return Result.Error(currentBoards.errors);

		sessionStorage.setItem(
			BOARD_STORAGE_KEY,
			JSON.stringify([...currentBoards.value, toBoardSessionStorage(data)]),
		);

		return Result.Success(data);
	},

	update: async (data: BoardModel) => {
		const currentBoards = await loadPersistedBoards();
		if (!currentBoards.isSuccess) return Result.Error(currentBoards.errors);

		const updatedBoards = currentBoards.value.map((b) =>
			b.id === data.id ? { ...b, name: data.name } : b,
		);

		sessionStorage.setItem(
			BOARD_STORAGE_KEY,
			JSON.stringify(updatedBoards.map((b) => toBoardSessionStorage(b))),
		);

		const updatedBoard = updatedBoards.find((b) => b.id === data.id);
		return !updatedBoard
			? Result.Error([boardRepositoryErrors.notFound(data.id)])
			: Result.Success(updatedBoard);
	},

	delete: async (data: BoardModel) => {
		const currentBoards = await loadPersistedBoards();
		if (!currentBoards.isSuccess) return Result.Error(currentBoards.errors);

		const updatedBoards = currentBoards.value.filter((b) => b.id !== data.id);

		sessionStorage.setItem(
			BOARD_STORAGE_KEY,
			JSON.stringify(updatedBoards.map((b) => toBoardSessionStorage(b))),
		);

		return Result.Success("Board deleted successfully");
	},
};

const boardSessionStorageSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	columnIds: z.array(z.string()),
});

type BoardSessionStorage = z.infer<typeof boardSessionStorageSchema>;
const boardListSessionStorageSchema = z.array(boardSessionStorageSchema);

export const loadPersistedBoards = async (): Promise<Result<BoardModel[]>> => {
	const persistedBoards = safeJsonParse<BoardSessionStorage[]>(
		sessionStorage.getItem(BOARD_STORAGE_KEY) as string,
	);
	if (!persistedBoards)
		return Result.Error([
			boardRepositoryErrors.dataNotFound(BOARD_STORAGE_KEY, "SESSION"),
		]);

	const boardsValidation =
		await boardListSessionStorageSchema.safeParseAsync(persistedBoards);

	if (!boardsValidation.success)
		return Result.Error([
			boardRepositoryErrors.corruptedData(
				BOARD_STORAGE_KEY,
				"The data not match the expected format.",
			),
		]);

	const toBoardModels: BoardModel[] = [];

	for (const boardSessionStorage of boardsValidation.data) {
		const boardModelResult = Board({
			id: boardSessionStorage.id,
			name: boardSessionStorage.name,
			columnIds: boardSessionStorage.columnIds,
		});

		if (!boardModelResult.isSuccess) {
			console.error(`invalid board`);
			continue;
		}

		toBoardModels.push(boardModelResult.value);
	}

	return Result.Success(toBoardModels);
};

const toBoardSessionStorage = (model: BoardModel): BoardSessionStorage => ({
	id: model.id,
	name: model.name,
	columnIds: model.columnIds,
});
