import { Result } from "@/shared/domain/result";
import { BoardFullDetailsModel } from "../domain/board.board-full-details.model";
import { IBoardRepository } from "../domain/board.repository";

export const getBoardDetails = (boardRepository: IBoardRepository) => {
	return {
		handle: async (id: string): Promise<Result<BoardFullDetailsModel>> => {
			if (!id) return Result.Failure([]);
			return boardRepository.getBoardDetails(id);
		},
	};
};
