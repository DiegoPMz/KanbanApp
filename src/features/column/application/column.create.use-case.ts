import { Result } from "@/shared/lib/result";
import { Column, ColumnModel } from "../domain/column.model";
import { IColumnRepository } from "../domain/column.repository";

export interface CreateColumnDto {
	name: string;
	color?: string;
	boardId: string;
	position: number;
}

export const createColumn = (columnRepository: IColumnRepository) => {
	return {
		handle: async (data: CreateColumnDto): Promise<Result<ColumnModel>> => {
			const columnCreatedResult = Column({
				name: data.name,
				position: data.position,
				boardId: data.boardId,
				color: data.color,
				taskIds: [],
			});

			return columnCreatedResult.isSuccess
				? columnRepository.create(columnCreatedResult.value)
				: Result.Error(columnCreatedResult.errors);
		},
	};
};
