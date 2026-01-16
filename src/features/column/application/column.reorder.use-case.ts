import { Result } from "@/shared/lib/result";
import { Column, ColumnModel } from "../domain/column.model";
import { IColumnRepository } from "../domain/column.repository";

export interface ReorderColumnDto {
	id: string;
	position: number;
}

export const reorderColumn = (columnRepository: IColumnRepository) => {
	return {
		handle: async (data: ReorderColumnDto): Promise<Result<ColumnModel[]>> => {
			const columnFoundedResult = await columnRepository.findById(data.id);
			if (!columnFoundedResult.isSuccess)
				return Result.Error(columnFoundedResult.errors);

			const columnReorderedResult = Column({
				...columnFoundedResult.value,
				position: data.position,
			});

			return columnReorderedResult.isSuccess
				? columnRepository.reorder(columnReorderedResult.value)
				: Result.Error(columnReorderedResult.errors);
		},
	};
};
