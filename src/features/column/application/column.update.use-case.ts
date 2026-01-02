import { Column } from "../domain/column.model";
import { IColumnRepository } from "../domain/column.repository";

export interface UpdateColumnDto {
	id: string;
	name?: string;
	color?: string;
}

export const updateColumn = (columnRepository: IColumnRepository) => {
	return {
		handle: async (data: UpdateColumnDto) => {
			const columnFoundedResult = await columnRepository.findById(data.id);
			if (!columnFoundedResult.isSuccess) return columnFoundedResult;

			const columnUpdatedResult = Column({
				...columnFoundedResult.value,
				name: data.name ?? columnFoundedResult.value.name,
				color: data.color ?? columnFoundedResult.value.color,
			});

			if (!columnUpdatedResult.isSuccess) return columnUpdatedResult;

			const columnSavedResult = columnRepository.update(
				columnUpdatedResult.value,
			);
			return columnSavedResult;
		},
	};
};
