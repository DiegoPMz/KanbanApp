import { Result } from "@/shared/domain/result";
import { Board, BoardModel } from "../domain/board.model";
import { IBoardRepository } from "../domain/board.repository";
import { useBoardStore } from "../store/board.store";
import { apiBoardRepository } from "./board.repository.api";

export const stateBoardRepository = (
	baseBoardRepository = apiBoardRepository,
): IBoardRepository => ({
	...baseBoardRepository,
	findById: async (boardId: BoardModel["id"]): Promise<Result<BoardModel>> => {
		const foundedBoardState = useBoardStore
			.getState()
			.boards.find((b) => b.id === boardId);

		if (foundedBoardState)
			return Board({
				id: foundedBoardState.id,
				name: foundedBoardState.name,
				columnIds: foundedBoardState.columnIds,
			});

		return baseBoardRepository.findById(boardId);
	},
});
