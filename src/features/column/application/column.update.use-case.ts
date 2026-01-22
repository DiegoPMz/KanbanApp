import { Result } from "@/shared/domain/result";
import { Column, ColumnModel } from "../domain/column.model";
import { IColumnRepository } from "../domain/column.repository";

export interface UpdateColumnDto {
	id: string;
	name?: string;
	color?: string;
}

export const updateColumn = (columnRepository: IColumnRepository) => {
	return {
		handle: async (data: UpdateColumnDto): Promise<Result<ColumnModel>> => {
			const columnFoundedResult = await columnRepository.findById(data.id);
			if (!columnFoundedResult.isSuccess) return columnFoundedResult;

			const columnUpdatedResult = Column({
				...columnFoundedResult.value,
				name: data.name ?? columnFoundedResult.value.name,
				color: data.color ?? columnFoundedResult.value.color,
			});

			return columnUpdatedResult.isSuccess
				? columnRepository.update(columnUpdatedResult.value)
				: columnUpdatedResult;
		},
	};
};
