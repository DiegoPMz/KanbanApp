import { ColumnModel } from "@/features/column/domain/column.model";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
	createBoard,
	CreateBoardDto,
} from "../application/board.create.use-case";
import {
	deleteBoard,
	DeleteBoardDto,
} from "../application/board.delete.use-case";
import {
	updateBoard,
	UpdateBoardDto,
} from "../application/board.update.use-case";
import { BoardModel } from "../domain/board.domain";
import { boardStateRepository } from "../infra/board.repository.state";

export interface BoardStateModel {
	id: string;
	name: string;
	columnIds: ColumnModel["id"][];
}

export interface BoardState {
	boards: BoardStateModel[];
	actions: {
		createBoardHandler: (data: CreateBoardDto) => Promise<BoardModel | null>;
		updateBoardHandler: (data: UpdateBoardDto) => Promise<BoardModel | null>;
		deleteBoardHandler: (data: DeleteBoardDto) => Promise<BoardModel | null>;
	};
}

export const useBoardStore = create<BoardState>()(
	devtools((set) => ({
		boards: [],

		actions: {
			createBoardHandler: async (data: CreateBoardDto) => {
				const result = await createBoard(boardStateRepository()).handle(data);
				if (!result.isSuccess) return null;

				set((state) => ({
					boards: [...state.boards, boardStateMapper(result.value)],
				}));

				return result.value;
			},

			updateBoardHandler: async (data: UpdateBoardDto) => {
				const result = await updateBoard(boardStateRepository()).handle(data);
				if (!result.isSuccess) return null;

				set((state) => ({
					boards: state.boards.map((b) =>
						b.id === data.id ? boardStateMapper(result.value) : b,
					),
				}));

				return result.value;
			},

			deleteBoardHandler: async (data: DeleteBoardDto) => {
				const result = await deleteBoard(boardStateRepository()).handle(data);
				if (!result.isSuccess) {
					// maybe trigger some alert
					return null;
				}

				set((state) => ({
					boards: state.boards.filter((b) => b.id !== result.value.id),
				}));

				return result.value;
			},
		},
	})),
);

function boardStateMapper(model: BoardModel): BoardStateModel {
	return {
		id: model.id,
		name: model.name,
		columnIds: model.columns.map((c) => c.id),
	};
}
