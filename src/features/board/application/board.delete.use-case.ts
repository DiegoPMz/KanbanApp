import { Result } from "@/shared/lib/result";
import { BoardModel } from "../domain/board.model";
import { IBoardRepository } from "./../domain/board.repository";

export interface DeleteBoardDto {
	id: BoardModel["id"];
}

export const deleteBoard = (boardRepository: IBoardRepository) => {
	return {
		handle: async (data: DeleteBoardDto): Promise<Result<BoardModel>> => {
			const boardFoundedResult = await boardRepository.findById(data.id);

			if (!boardFoundedResult.isSuccess)
				return Result.Error(boardFoundedResult.errors);

			const boardDeletedResult = await boardRepository.delete({
				...boardFoundedResult.value,
			});

			return boardDeletedResult.isSuccess
				? boardFoundedResult
				: Result.Error(boardDeletedResult.errors);
		},
	};
};
