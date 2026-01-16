import { Column, ColumnModel } from "@/features/column/domain/column.model";
import { httpClient } from "@/shared/api/api.client";
import { ProblemDetails } from "@/shared/api/http-error.interceptor";
import { AppError, Result } from "@/shared/lib/result";
import { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import {
	columnPersistenceErrors,
	columnValidationErrors,
} from "../domain/column.errors";
import { IColumnRepository } from "../domain/column.repository";

interface ColumnApiDto {
	id: string;
	name: string;
	color: string;
	position: number;
	boardId: string;
}

interface CreateColumnRequest {
	name: string;
	color: string;
	position: number;
	boardId: string;
}

interface ReorderBodyRequest {
	boardId: string;
	id: string;
	position: number;
}

export const apiColumnRepository: IColumnRepository = {
	findById: async (
		columnId: ColumnModel["id"],
	): Promise<Result<ColumnModel>> => {
		try {
			const res = await httpClient.get<ColumnApiDto>(`/columns/${columnId}`);
			return toColumn(res.data);
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ProblemDetails;

				if (response.status === HttpStatusCode.NotFound)
					return Result.Error([columnPersistenceErrors.notFound(columnId)]);

				if (response.status === HttpStatusCode.BadRequest)
					return Result.Error([columnValidationErrors.invalidId(columnId)]);
			}

			return Result.Error([
				columnPersistenceErrors.dataNotFound("UNDEFINED", "api"),
			]);
		}
	},

	create: async (data: ColumnModel): Promise<Result<ColumnModel>> => {
		const createColumn: CreateColumnRequest = {
			name: data.name,
			color: data.color,
			position: data.position,
			boardId: data.boardId,
		};

		try {
			const res = await httpClient.post<ColumnApiDto>("/columns", createColumn);
			return toColumn(res.data);
		} catch (error) {
			if (!(error instanceof AxiosError))
				return Result.Error([
					columnPersistenceErrors.dataNotFound("UNDEFINED", "api"),
				]);

			const response = error.response?.data as ProblemDetails;

			if (response.status === HttpStatusCode.BadRequest) {
				const badRequestErrors: AppError[] = [];

				if (response.errors?.color)
					badRequestErrors.push(
						columnValidationErrors.invalidColor("UNDEFINED", data.color),
					);
				if (response.errors?.name)
					badRequestErrors.push(
						columnValidationErrors.tooLongName("UNDEFINED"),
					);

				if (badRequestErrors.length > 0) return Result.Error(badRequestErrors);
			}

			return Result.Error([
				columnPersistenceErrors.dataNotFound("UNDEFINED", "api"),
			]);
		}
	},

	update: async (data: ColumnModel): Promise<Result<ColumnModel>> => {
		try {
			const res = await httpClient.put<ColumnApiDto>(`/columns/${data.id}`, {
				boardId: data.boardId,
				name: data.name,
				color: data.color,
			});

			return toColumn(res.data);
		} catch (error) {
			if (!(error instanceof AxiosError))
				return Result.Error([
					columnPersistenceErrors.dataNotFound("UNDEFINED", "api"),
				]);

			const response = error.response?.data as ProblemDetails;

			if (response.status === HttpStatusCode.NotFound)
				return Result.Error([columnPersistenceErrors.notFound(data.id)]);

			if (response.status === HttpStatusCode.BadRequest) {
				const badRequestErrors: AppError[] = [];

				if (response.errors?.color)
					badRequestErrors.push(
						columnValidationErrors.invalidColor("UNDEFINED", data.color),
					);
				if (response.errors?.name)
					badRequestErrors.push(
						columnValidationErrors.tooLongName("UNDEFINED"),
					);

				if (badRequestErrors.length > 0) return Result.Error(badRequestErrors);
			}

			return Result.Error([
				columnPersistenceErrors.dataNotFound("UNDEFINED", "api"),
			]);
		}
	},

	delete: async (data: ColumnModel) => {
		try {
			const res = await httpClient.delete<string>(`/columns/${data.id}`);
			return res.data ? Result.Success(res.data) : Result.Error([]);
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ProblemDetails;

				if (response.status === HttpStatusCode.NotFound)
					return Result.Error([columnPersistenceErrors.notFound(data.id)]);

				if (response.status === HttpStatusCode.BadRequest)
					return Result.Error([columnValidationErrors.invalidId(data.id)]);
			}

			return Result.Error([
				columnPersistenceErrors.dataNotFound("UNDEFINED", "api"),
			]);
		}
	},

	reorder: async (data: ColumnModel) => {
		try {
			const res = await httpClient.put<
				ColumnApiDto[],
				AxiosResponse<ColumnApiDto[]>,
				ReorderBodyRequest
			>(`/columns/reorder`, {
				boardId: data.boardId,
				id: data.id,
				position: data.position,
			});

			const columnModelList = res.data.map((columnApiDto) =>
				toColumn(columnApiDto),
			);

			if (columnModelList.find((c) => !c.isSuccess)) return Result.Error([]);
			return Result.Success(columnModelList.map((c) => c.value));
		} catch (error) {
			if (!(error instanceof AxiosError))
				return Result.Error([
					columnPersistenceErrors.dataNotFound("UNDEFINED", "api"),
				]);

			const response = error.response?.data as ProblemDetails;

			if (response.status === HttpStatusCode.NotFound)
				return Result.Error([columnPersistenceErrors.notFound(data.id)]);

			if (response.status === HttpStatusCode.BadRequest) {
				const badRequestErrors: AppError[] = [];

				if (response.errors?.id)
					badRequestErrors.push(columnValidationErrors.invalidId(data.id));
				if (response.errors?.position)
					badRequestErrors.push(
						columnValidationErrors.negativePosition(data.id, data.position),
					);

				if (badRequestErrors.length > 0) return Result.Error(badRequestErrors);
			}

			return Result.Error([
				columnPersistenceErrors.dataNotFound("UNDEFINED", "api"),
			]);
		}
	},
};

const toColumn = (dto: ColumnApiDto) =>
	Column({
		id: dto.id,
		name: dto.name,
		position: dto.position,
		boardId: dto.boardId,
		taskIds: [],
	});
