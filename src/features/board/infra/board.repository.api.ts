import { ColumnModel } from "@/features/column";
import { SubTaskModel } from "@/features/subTask/domain/subTask.model";
import { TaskModel } from "@/features/task";
import { globalErrors } from "@/shared/domain/errors/global.error";
import { PaginatedResponse } from "@/shared/domain/paginated-response.read-model";
import { Pagination } from "@/shared/domain/pagination.value-object";
import { Result, ResultError } from "@/shared/domain/result";
import { HttpClientErrorResponse } from "@/shared/infra/http/axios-error.interceptor";
import { httpClient } from "@/shared/infra/http/http.client";
import { mapGlobalHttpError } from "@/shared/infra/mappers/global-http-error.mapper";
import { mapHttpPaginationErrorToResult } from "@/shared/infra/mappers/pagination-http-error.mapper";
import { HttpStatusCode } from "axios";
import { BoardFullDetailsModel } from "../domain/board.board-full-details.read-model";
import {
	boardRepositoryErrors,
	boardValidationErrors,
} from "../domain/board.errors";
import { Board, BoardModel } from "../domain/board.model";
import { IBoardRepository } from "../domain/board.repository";

export interface BoardApiDto {
	id: string;
	name: string;
}

export interface BoardFullDetailsDTO {
	id: string;
	name: string;
	columns: ColumnFullDetailsDto[];
}

export interface ColumnFullDetailsDto {
	id: string;
	boardId: string;
	name: string;
	color: string;
	position: number;
	boardTasks: BoardTaskFullDetailsDto[];
}

export interface BoardTaskFullDetailsDto {
	id: string;
	columnId: string;
	title: string;
	description: string;
	isCompleted: boolean;
	position: number;
	priority: "low" | "medium" | "high";
	subTasks: SubTaskFullDetailsDto[];
}

export interface SubTaskFullDetailsDto {
	id: string;
	boardTaskId: string;
	description: string;
	isCompleted: boolean;
}

export const apiBoardRepository: IBoardRepository = {
	search: async (
		pagination: Pagination,
	): Promise<Result<PaginatedResponse<BoardModel>>> => {
		const params = new URLSearchParams();
		params.append("limit", pagination.limit.toString());

		if (pagination.cursor) params.append("cursor", pagination.cursor);

		return httpClient
			.get<PaginatedResponse<BoardApiDto>>(`/boards?${params.toString()}`)
			.then(({ data }) => {
				const domainItems = data.items.map((dto) => toBoard(dto).value);
				const paginatedResponse: PaginatedResponse<BoardModel> = {
					...data,
					items: domainItems,
				};

				return Result.Success(paginatedResponse);
			})
			.catch((error: HttpClientErrorResponse) =>
				mapHttpPaginationErrorToResult<PaginatedResponse<BoardModel>>(
					error,
					pagination,
				),
			);
	},
	findById: (boardId: BoardModel["id"]): Promise<Result<BoardModel>> =>
		httpClient
			.get<BoardApiDto>(`/boards/${boardId}`)
			.then((res) => toBoard(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpBoardErrorToResult(error, { id: boardId } as BoardModel),
			),

	create: (data: BoardModel): Promise<Result<BoardModel>> =>
		httpClient
			.post<BoardApiDto>("/boards", {
				name: data.name,
			})
			.then((res) => toBoard(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpBoardErrorToResult(error, data),
			),

	update: (data: BoardModel): Promise<Result<BoardModel>> =>
		httpClient
			.patch<BoardApiDto>(`/boards/${data.id}`, {
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

const toBoard = (dto: BoardApiDto): Result<BoardModel> =>
	Board({
		id: dto.id,
		name: dto.name,
		columnIds: [],
	});

const mapToBoardData = (dto: BoardFullDetailsDTO): BoardFullDetailsModel => {
	const columns: ColumnModel[] = [];
	const tasks: TaskModel[] = [];
	const subTasks: SubTaskModel[] = [];

	const board: BoardModel = {
		id: dto.id,
		name: dto.name,
		columnIds: [],
	};

	dto.columns.forEach((col) => {
		board.columnIds.push(col.id);

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
				subTaskIds: task.subTasks.map((st) => st.id),
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

	return { board, columns, tasks, subTasks };
};

export const mapHttpBoardErrorToResult = <R = BoardModel>(
	error: HttpClientErrorResponse,
	model: BoardModel,
): Result<R> => {
	const global = mapGlobalHttpError(error);
	if (global) return Result.Failure([global]);

	const statusCode = error.response?.status ?? error.status;
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

	return Result.Failure([globalErrors.serverError()]);
};
