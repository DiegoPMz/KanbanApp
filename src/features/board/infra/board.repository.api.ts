import { ColumnModel } from "@/features/column";
import { SubTaskModel } from "@/features/subTask/domain/subTask.model";
import { TaskModel } from "@/features/task";
import { httpClient } from "@/shared/api/api.client";
import { ProblemDetails } from "@/shared/api/http-error.interceptor";
import { Result } from "@/shared/lib/result";
import { AxiosError, HttpStatusCode } from "axios";
import { BoardFullDetailsModel } from "../domain/board.board-full-details.model";
import {
	boardRepositoryErrors,
	boardValidationErrors,
} from "../domain/board.errors";
import { Board, BoardModel } from "../domain/board.model";
import { IBoardRepository } from "../domain/board.repository";

interface boardDto {
	id: string;
	name: string;
}

interface BoardFullDetailsDTO {
	id: string;
	name: string;
	columns: Array<{
		id: string;
		boardId: string;
		name: string;
		color: string;
		position: number;
		boardTasks: Array<{
			id: string;
			columnId: string;
			title: string;
			description: string;
			isCompleted: boolean;
			position: number;
			priority: string;
			subTasks: Array<{
				id: string;
				boardTaskId: string;
				description: string;
				isCompleted: boolean;
			}>;
		}>;
	}>;
}

export const apiBoardRepository: IBoardRepository = {
	// TODO: implement proper pagination
	findPaginated: async (page: number, limit: number) => {
		try {
			const response = await httpClient.get<boardDto[]>(
				`/boards?page=${page}&limit=${limit}`,
			);

			const toBoardModels: BoardModel[] = [];

			for (const boardDto of response.data) {
				const boardModelResult = Board({
					id: boardDto.id,
					name: boardDto.name,
					columnIds: [],
				});

				if (!boardModelResult.isSuccess) {
					console.error(
						`invalid board. Id:${boardDto.id}, Name : ${boardDto.name}`,
					);
					continue;
				}

				toBoardModels.push(boardModelResult.value);
			}

			return Result.Success(toBoardModels);
		} catch {
			return Result.Error([]);
		}
	},

	findById: async (boardId: BoardModel["id"]): Promise<Result<BoardModel>> => {
		try {
			const res = await httpClient.get<boardDto>(`/boards/${boardId}`);
			return Board({
				id: res.data.id,
				name: res.data.name,
				columnIds: [],
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ProblemDetails;

				if (response.status === HttpStatusCode.NotFound)
					return Result.Error([boardRepositoryErrors.notFound(boardId)]);

				if (response.status === HttpStatusCode.BadRequest)
					return Result.Error([boardValidationErrors.invalidId(boardId)]);
			}

			return Result.Error([
				boardRepositoryErrors.dataNotFound("UNDEFINED", "api"),
			]);
		}
	},

	create: async (data: BoardModel): Promise<Result<BoardModel>> => {
		try {
			const res = await httpClient.post<boardDto>("/boards", {
				name: data.name,
			});
			return Board({
				id: res.data.id,
				name: res.data.name,
				columnIds: [],
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ProblemDetails;

				return response.errors?.name
					? Result.Error([
							{
								code: "BOARD_NAME_INVALID",
								message: response.errors.name[0],
								details: { id: data.id, date: new Date().toISOString() },
							},
						])
					: Result.Error([
							boardRepositoryErrors.dataNotFound("UNDEFINED", "api"),
						]);
			}

			return Result.Error([
				boardRepositoryErrors.dataNotFound("UNDEFINED", "api"),
			]);
		}
	},

	update: async (data: BoardModel): Promise<Result<BoardModel>> => {
		try {
			const res = await httpClient.patch<boardDto>(`/boards/${data.id}`, {
				name: data.name,
			});
			return Board({
				id: res.data.id,
				name: res.data.name,
				columnIds: data.columnIds,
			});
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ProblemDetails;

				if (response.status === HttpStatusCode.NotFound)
					return Result.Error([boardRepositoryErrors.notFound(data.id)]);

				if (response.status === HttpStatusCode.BadRequest)
					return response.errors?.name
						? Result.Error([
								{
									code: "BOARD_NAME_INVALID",
									message: response.errors.name[0],
									details: { id: data.id, date: new Date().toISOString() },
								},
							])
						: Result.Error([
								boardRepositoryErrors.dataNotFound("UNDEFINED", "api"),
							]);
			}

			return Result.Error([
				boardRepositoryErrors.dataNotFound("UNDEFINED", "api"),
			]);
		}
	},

	delete: async (data: BoardModel) => {
		try {
			const res = await httpClient.delete<string>(`/boards/${data.id}`);
			return res.data ? Result.Success(res.data) : Result.Error([]);
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ProblemDetails;

				if (response.status === HttpStatusCode.NotFound)
					return Result.Error([boardRepositoryErrors.notFound(data.id)]);

				if (response.status === HttpStatusCode.BadRequest)
					return Result.Error([boardValidationErrors.invalidId(data.id)]);
			}

			return Result.Error([
				boardRepositoryErrors.dataNotFound("UNDEFINED", "api"),
			]);
		}
	},

	getBoardDetails: async (id: string) => {
		try {
			const res = await httpClient.get<BoardFullDetailsDTO>(
				`/boards/${id}/full-details`,
			);

			return Result.Success(mapToBoardData(res.data));
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ProblemDetails;

				if (response.status === HttpStatusCode.NotFound)
					return Result.Error([boardRepositoryErrors.notFound(id)]);

				if (response.status === HttpStatusCode.BadRequest)
					return Result.Error([boardValidationErrors.invalidId(id)]);
			}

			return Result.Error([
				boardRepositoryErrors.dataNotFound("UNDEFINED", "api"),
			]);
		}
	},
};

const mapToBoardData = (dto: BoardFullDetailsDTO): BoardFullDetailsModel => {
	const columns: ColumnModel[] = [];
	const tasks: TaskModel[] = [];
	const subTasks: SubTaskModel[] = [];

	dto.columns.forEach((col) => {
		columns.push({
			id: col.id,
			boardId: col.boardId,
			name: col.name,
			color: col.color,
			position: col.position,
			taskIds: col.boardTasks.map((task) => task.id),
		});

		col.boardTasks.forEach((task) => {
			tasks.push({
				id: task.id,
				columnId: task.columnId,
				title: task.title,
				description: task.description,
				isCompleted: task.isCompleted,
				position: task.position,
				priority: task.priority,
				subtaskIds: task.subTasks.map((st) => st.id),
			});

			task.subTasks.forEach((st) => {
				subTasks.push({
					id: st.id,
					taskId: st.boardTaskId,
					description: st.description,
					isCompleted: st.isCompleted,
				});
			});
		});
	});

	return { columns, tasks, subTasks };
};
