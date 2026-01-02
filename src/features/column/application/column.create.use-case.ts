import { Column } from "../domain/column.model";
import { IColumnRepository } from "../domain/column.repository";

export interface CreateColumnDto {
	name: string;
	color?: string;
	boardId: string;
	position: number;
}

export const createColumn = (columnRepository: IColumnRepository) => {
	return {
		handle: async (data: CreateColumnDto) => {
			const columnCreatedResult = Column({
				name: data.name,
				position: data.position,
				boardId: data.boardId,
				color: data.color,
				tasks: [],
			});

			if (!columnCreatedResult.isSuccess) return columnCreatedResult;

			const columnSavedResult = await columnRepository.create(
				columnCreatedResult.value,
			);
			if (!columnSavedResult.isSuccess) return columnSavedResult;

			return columnSavedResult;
		},
	};
};
