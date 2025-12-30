import { Result } from "@/shared/lib/result";
import { Board, BoardModel } from "../domain/board.domain";
import { IBoardRepository } from "../domain/board.repository";
import { useBoardStore } from "../store/board.store";
import { apiBoardRepository } from "./board.repository.api";

export const boardStateRepository = (
	baseBoardRepository = apiBoardRepository,
): IBoardRepository => ({
	...baseBoardRepository,
	findById: async (boardId: BoardModel["id"]): Promise<Result<BoardModel>> => {
		const boardInState = useBoardStore
			.getState()
			.boards.find((b) => b.id === boardId);

		if (boardInState)
			return Board({
				id: boardInState.id,
				name: boardInState.name,
				columns: [],
			});

		return baseBoardRepository.findById(boardId);
	},
});
