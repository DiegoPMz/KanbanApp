import { ColumnModel } from "@/features/column";
import { SubTaskModel } from "@/features/subTask/domain/subTask.model";
import { TaskModel } from "@/features/task";
import { ResultError, Result } from "@/shared/domain/result";
import { HttpClientErrorResponse } from "@/shared/infra/http/axios-error.interceptor";
import { httpClient } from "@/shared/infra/http/http.client";
import { HttpStatusCode } from "axios";
import { BoardFullDetailsModel } from "../domain/board.board-full-details.model";
import {
	boardRepositoryErrors,
	boardValidationErrors,
} from "../domain/board.errors";
import { Board, BoardModel } from "../domain/board.model";
import { IBoardRepository } from "../domain/board.repository";

interface boardApiDto {
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
			priority: "low" | "medium" | "high";
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
	findPaginated: (page: number, limit: number): Promise<Result<BoardModel[]>> =>
		httpClient
			.get<boardApiDto[]>(`/boards?page=${page}&limit=${limit}`)
			.then((res) =>
				Result.Success(res.data.map((toBoardDto) => toBoard(toBoardDto).value)),
			)
			.catch(() =>
				Result.Failure([
					boardRepositoryErrors.dataNotFound("UNDEFINED", "api"),
				]),
			),

	findById: (boardId: BoardModel["id"]): Promise<Result<BoardModel>> =>
		httpClient
			.get<boardApiDto>(`/boards/${boardId}`)
			.then((res) => toBoard(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpBoardErrorToResult(error, { id: boardId } as BoardModel),
			),

	create: (data: BoardModel): Promise<Result<BoardModel>> =>
		httpClient
			.post<boardApiDto>("/boards", {
				name: data.name,
			})
			.then((res) => toBoard(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpBoardErrorToResult(error, data),
			),

	update: (data: BoardModel): Promise<Result<BoardModel>> =>
		httpClient
			.patch<boardApiDto>(`/boards/${data.id}`, {
				name: data.name,
			})
			.then((res) => toBoard(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpBoardErrorToResult(error, data),
			),

	delete: (data: BoardModel): Promise<Result<string>> =>
		httpClient
			.delete<string>(`/boards/${data.id}`)
			.then((res) => Result.Success(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpBoardErrorToResult<string>(error, data),
			),

	getBoardDetails: (id: string): Promise<Result<BoardFullDetailsModel>> =>
		httpClient
			.get<BoardFullDetailsDTO>(`/boards/${id}/full-details`)
			.then((res) => Result.Success(mapToBoardData(res.data)))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpBoardErrorToResult<BoardFullDetailsModel>(error, {
					id,
				} as BoardModel),
			),
};

const toBoard = (dto: boardApiDto): Result<BoardModel> =>
	Board({
		id: dto.id,
		name: dto.name,
		columnIds: [],
	});

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

const mapHttpBoardErrorToResult = <R = BoardModel>(
	error: HttpClientErrorResponse,
	model: BoardModel,
): Result<R> => {
	const statusCode = error.response?.status;
	const responseData = error.response?.data;

	if (statusCode === HttpStatusCode.NotFound) {
		return Result.Failure([boardRepositoryErrors.notFound(model.id)]);
	}

	if (statusCode === HttpStatusCode.BadRequest && responseData?.errors) {
		const validationErrors: ResultError[] = [];
		const fields = responseData.errors;

		if (fields.id)
			validationErrors.push(boardValidationErrors.invalidId(model.id));

		if (fields.name)
			validationErrors.push(
				boardValidationErrors.tooLongName(model.name.length, model.id),
			);

		if (validationErrors.length > 0) return Result.Failure(validationErrors);
	}

	return Result.Failure([boardRepositoryErrors.dataNotFound("/boards", "api")]);
};
