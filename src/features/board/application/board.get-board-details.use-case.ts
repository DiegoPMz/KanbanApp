import { Result } from "@/shared/domain/result";
import { BoardFullDetailsModel } from "../domain/board.board-full-details.read-model";
import { IBoardRepository } from "../domain/board.repository";
import { boardValidationErrors } from "../domain/board.errors";

export const getBoardDetails = (boardRepository: IBoardRepository) => {
	return {
		handle: async (id: string): Promise<Result<BoardFullDetailsModel>> => {
			if (!id) return Result.Failure([boardValidationErrors.invalidId(id)]);
			return boardRepository.getBoardDetails(id);
		},
	};
};
