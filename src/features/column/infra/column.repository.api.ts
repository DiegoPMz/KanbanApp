import { Column, ColumnModel } from "@/features/column/domain/column.model";
import { httpClient } from "@/shared/api/api.client";
import { Result } from "@/shared/lib/result";
import { AxiosResponse } from "axios";
import { IColumnRepository } from "../domain/column.repository";

interface CreateColumnRequest {
	name: string;
	color: string;
	position: number;
	boardId: string;
}

interface ColumnEntity {
	id: string;
	name: string;
	color: string;
	position: number;
	boardId: string;
	boardTask: [];
}

interface ReorderBody {
	boardId: string;
	id: string;
	position: number;
}

export const apiColumnRepository: IColumnRepository = {
	findById: async (
		columnId: ColumnModel["id"],
	): Promise<Result<ColumnModel>> => {
		try {
			const res = await httpClient.get<ColumnEntity>(`/columns/${columnId}`);
			return toColumn(res.data);
		} catch {
			return Result.Error([]);
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
			const res = await httpClient.post<ColumnEntity>("/columns", createColumn);
			return toColumn(res.data);
		} catch {
			return Result.Error([]);
		}
	},

	update: async (data: ColumnModel): Promise<Result<ColumnModel>> => {
		try {
			const res = await httpClient.put<ColumnEntity>("/columns", {
				boardId: data.boardId,
				id: data.id,
				name: data.name,
				color: data.color,
			});

			return toColumn(res.data);
		} catch {
			return Result.Error([]);
		}
	},

	delete: async (data: ColumnModel) => {
		try {
			const response = await httpClient.delete<string>(`/columns/${data.id}`);
			return response.data ? Result.Success(response.data) : Result.Error([]);
		} catch {
			return Result.Error([]);
		}
	},

	reorder: async (data: ColumnModel) => {
		try {
			const response = await httpClient.put<
				ColumnModel[],
				AxiosResponse<ColumnModel[]>,
				ReorderBody
			>(`/columns/reorder`, {
				boardId: data.boardId,
				id: data.id,
				position: data.position,
			});
			return response.data ? Result.Success(response.data) : Result.Error([]);
		} catch {
			return Result.Error([]);
		}
	},
};

const toColumn = (model: ColumnEntity) =>
	Column({
		id: model.id,
		name: model.name,
		position: model.position,
		boardId: model.boardId,
		tasks: [],
	});
