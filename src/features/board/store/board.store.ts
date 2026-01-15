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
	getBoardsPaginated,
	GetBoardsPaginatedDto,
} from "../application/board.get-boards-paginated.use-case";
import {
	updateBoard,
	UpdateBoardDto,
} from "../application/board.update.use-case";
import { BoardModel } from "../domain/board.model";
import { stateBoardRepository } from "../infra/board.repository.state";

export interface BoardStateModel {
	id: string;
	name: string;
	columnIds: string[];
}

export interface BoardState {
	boards: BoardStateModel[];
	actions: {
		createBoardHandler: (data: CreateBoardDto) => Promise<BoardModel | null>;
		getBoardsPaginatedHandler: (
			data: GetBoardsPaginatedDto,
		) => Promise<BoardModel[]>;
		updateBoardHandler: (data: UpdateBoardDto) => Promise<BoardModel | null>;
		deleteBoardHandler: (data: DeleteBoardDto) => Promise<BoardModel | null>;
	};
}

export const useBoardStore = create<BoardState>()(
	devtools((set) => ({
		boards: [],

		actions: {
			createBoardHandler: async (data: CreateBoardDto) => {
				const result = await createBoard(stateBoardRepository()).handle(data);
				if (!result.isSuccess) return null;

				set((state) => ({
					boards: [...state.boards, toBoarState(result.value)],
				}));

				return result.value;
			},

			getBoardsPaginatedHandler: async (data: GetBoardsPaginatedDto) => {
				const result = await getBoardsPaginated(stateBoardRepository()).handle(
					data,
				);
				if (!result.isSuccess) return null;

				set((state) => ({
					boards: [
						...state.boards,
						...result.value.map((bm) => toBoarState(bm)),
					],
				}));

				return result.value;
			},

			updateBoardHandler: async (data: UpdateBoardDto) => {
				const result = await updateBoard(stateBoardRepository()).handle(data);
				if (!result.isSuccess) return null;

				set((state) => ({
					boards: state.boards.map((b) =>
						b.id === data.id ? toBoarState(result.value) : b,
					),
				}));

				return result.value;
			},

			deleteBoardHandler: async (data: DeleteBoardDto) => {
				const result = await deleteBoard(stateBoardRepository()).handle(data);
				if (!result.isSuccess) return null;

				set((state) => ({
					boards: state.boards.filter((b) => b.id !== result.value.id),
				}));

				return result.value;
			},
		},
	})),
);

const toBoarState = (model: BoardModel): BoardStateModel => ({
	id: model.id,
	name: model.name,
	columnIds: model.columnIds,
});
