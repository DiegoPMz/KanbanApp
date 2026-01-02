import { Result } from "@/shared/lib/result";
import { ColumnModel } from "../domain/column.model";
import { IColumnRepository } from "../domain/column.repository";

export interface DeleteColumnDto {
	id: string;
}

export const deleteColumn = (columnRepository: IColumnRepository) => {
	return {
		handle: async (data: DeleteColumnDto) => {
			const columnFoundedResult = await columnRepository.findById(data.id);
			if (!columnFoundedResult.isSuccess) return columnFoundedResult;

			const columnDeletedResult = await columnRepository.delete(
				columnFoundedResult.value,
			);

			return columnDeletedResult.isSuccess
				? columnFoundedResult
				: Result.Error<ColumnModel>(columnDeletedResult.errors);
		},
	};
};
