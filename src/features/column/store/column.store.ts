import { DeleteBoardDto } from "@/features/board/application/board.delete.use-case";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
	createColumn,
	CreateColumnDto,
} from "../application/column.create.use-case";
import { deleteColumn } from "../application/column.delete.use-case";
import { reorderColumn } from "../application/column.reorder.use-case";
import {
	updateColumn,
	UpdateColumnDto,
} from "../application/column.update.use-case";
import { ColumnModel } from "../domain/column.model";
import { StateColumnRepository } from "../infra/column.repository.state";

export interface ColumnStateModel {
	boardId: string;
	id: string;
	name: string;
	color: string;
	position: number;
}

interface ColumnState {
	columns: ColumnStateModel[];
	actions: {
		createColumnHandler: (data: CreateColumnDto) => Promise<ColumnModel | null>;
		updateColumnHandler: (data: UpdateColumnDto) => Promise<ColumnModel | null>;
		reorderColumnHandler: (
			data: ColumnStateModel,
		) => Promise<ColumnModel | null>;
		deleteColumnHandler: (data: DeleteBoardDto) => Promise<ColumnModel | null>;
	};
}

export const useColumnStore = create<ColumnState>()(
	devtools((set) => ({
		columns: [],
		actions: {
			createColumnHandler: async (data: CreateColumnDto) => {
				const result = await createColumn(StateColumnRepository()).handle(data);
				if (!result.isSuccess) {
					return null;
				}

				set((state) => ({
					columns: [...state.columns, toColumnState(result.value)],
				}));
				return result.value;
			},
			updateColumnHandler: async (data: UpdateColumnDto) => {
				const result = await updateColumn(StateColumnRepository()).handle(data);
				if (!result.isSuccess) {
					return null;
				}

				set((state) => ({
					columns: state.columns.map((c) =>
						c.id === result.value.id ? toColumnState(result.value) : c,
					),
				}));

				return result.value;
			},
			reorderColumnHandler: async (data: ColumnStateModel) => {
				const result = await reorderColumn(StateColumnRepository()).handle({
					id: data.id,
					position: data.position,
				});
				if (!result.isSuccess) {
					return null;
				}

				const reorderedColumns = result.value.map((c) => toColumnState(c));

				set((state) => ({
					columns: [
						...state.columns.filter((c) => c.boardId !== data.boardId),
						...reorderedColumns,
					],
				}));

				return result.value.find((c) => c.id === data.id) ?? null;
			},
			deleteColumnHandler: async (data: DeleteBoardDto) => {
				const result = await deleteColumn(StateColumnRepository()).handle(data);
				if (!result.isSuccess) {
					return null;
				}

				set((state) => ({
					columns: state.columns.filter((c) => c.id !== result.value.id),
				}));

				return result.value;
			},
		},
	})),
);

export const setInitialColumns = (columns: ColumnModel[]) => {
	if (columns.length < 1) return;

	useColumnStore.setState((state) => ({
		columns: [...state.columns, ...columns],
	}));
};

const toColumnState = (model: ColumnModel): ColumnStateModel => ({
	boardId: model.boardId,
	id: model.id,
	name: model.name,
	color: model.color,
	position: model.position,
});
