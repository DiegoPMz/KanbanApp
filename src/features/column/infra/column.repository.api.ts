import { Column, ColumnModel } from "@/features/column/domain/column.model";
import { ResultError, Result } from "@/shared/domain/result";
import { HttpClientErrorResponse } from "@/shared/infra/http/axios-error.interceptor";
import { httpClient } from "@/shared/infra/http/http.client";
import { HttpStatusCode } from "axios";
import {
	columnPersistenceErrors,
	columnValidationErrors,
} from "../domain/column.errors";
import { IColumnRepository } from "../domain/column.repository";
import { mapGlobalHttpError } from "@/shared/infra/mappers/global-http-error.mapper";

interface ColumnApiDto {
	id: string;
	name: string;
	color: string;
	position: number;
	boardId: string;
}

export const apiColumnRepository: IColumnRepository = {
	findById: (columnId: ColumnModel["id"]): Promise<Result<ColumnModel>> =>
		httpClient
			.get<ColumnApiDto>(`/columns/${columnId}`)
			.then((res) => toColumn(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpColumnErrorToResult(error, { id: columnId } as ColumnModel),
			),

	create: (data: ColumnModel): Promise<Result<ColumnModel>> =>
		httpClient
			.post<ColumnApiDto>("/columns", {
				name: data.name,
				color: data.color,
				position: data.position,
				boardId: data.boardId,
			})
			.then((res) => toColumn(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpColumnErrorToResult(error, data),
			),

	update: async (data: ColumnModel): Promise<Result<ColumnModel>> =>
		httpClient
			.patch<ColumnApiDto>(`/columns/${data.id}`, {
				name: data.name,
				color: data.color,
			})
			.then((res) => toColumn(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpColumnErrorToResult(error, data),
			),

	delete: (data: ColumnModel): Promise<Result<string>> =>
		httpClient
			.delete<string>(`/columns/${data.id}`)
			.then((res) => Result.Success(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpColumnErrorToResult<string>(error, data),
			),

	reorder: async (data: ColumnModel): Promise<Result<ColumnModel[]>> =>
		httpClient
			.patch<ColumnApiDto[]>(`/columns/reorder`, {
				boardId: data.boardId,
				id: data.id,
				position: data.position,
			})
			.then((res) => Result.Success(res.data.map((c) => toColumn(c).value)))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpColumnErrorToResult(error, data),
			),
};

const toColumn = (dto: ColumnApiDto) =>
	Column({
		id: dto.id,
		name: dto.name,
		position: dto.position,
		boardId: dto.boardId,
		taskIds: [],
	});

const mapHttpColumnErrorToResult = <R = ColumnModel>(
	error: HttpClientErrorResponse,
	model: ColumnModel,
): Result<R> => {
	const global = mapGlobalHttpError(error);
	if (global) return Result.Failure([global]);

	const statusCode = error.response?.status ?? error.status;
	const responseData = error.response?.data;

	if (statusCode === HttpStatusCode.NotFound) {
		return Result.Failure([columnPersistenceErrors.notFound(model.id)]);
	}

	if (statusCode === HttpStatusCode.BadRequest && responseData?.errors) {
		const validationErrors: ResultError[] = [];
		const fields = responseData.errors;

		if (fields.id)
			validationErrors.push(columnValidationErrors.invalidId(model.id));

		if (fields.name)
			validationErrors.push(
				columnValidationErrors.tooLongName(model.name.length, model.id),
			);

		if (fields.color)
			validationErrors.push(
				columnValidationErrors.invalidColor(model.color, model.id),
			);

		if (fields.position)
			validationErrors.push(
				columnValidationErrors.negativePosition(model.position, model.id),
			);

		if (fields.boardId)
			validationErrors.push(
				columnValidationErrors.invalidBoardId(model.boardId, model.id),
			);

		if (validationErrors.length > 0) return Result.Failure(validationErrors);
	}

	return Result.Failure([
		columnPersistenceErrors.dataNotFound("/columns", "api"),
	]);
};
