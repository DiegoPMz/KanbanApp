import { Result } from "@/shared/lib/result";
import { Column, ColumnModel } from "../domain/column.model";
import { IColumnRepository } from "../domain/column.repository";
import { useColumnStore } from "../store/column.store";
import { apiColumnRepository } from "./column.repository.api";

export const StateColumnRepository = (
	baseColumnRepository = apiColumnRepository,
): IColumnRepository => ({
	...baseColumnRepository,
	findById: async (
		columnId: ColumnModel["id"],
	): Promise<Result<ColumnModel>> => {
		const columnInState = useColumnStore
			.getState()
			.columns.find((c) => c.id === columnId);

		if (columnInState)
			return Column({
				id: columnInState.id,
				name: columnInState.name,
				boardId: columnInState.boardId,
				position: columnInState.position,
				tasks: [],
			});

		return baseColumnRepository.findById(columnId);
	},
});
