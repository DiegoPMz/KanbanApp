import { Result } from "@/shared/lib/result";
import { BoardModel } from "../domain/board.domain";
import { IBoardRepository } from "./../domain/board.repository";

export interface DeleteBoardDto {
	id: BoardModel["id"];
}

export const deleteBoard = (boardRepository: IBoardRepository) => {
	return {
		handle: async (data: DeleteBoardDto): Promise<Result<BoardModel>> => {
			const boardToDeleteResult = await boardRepository.findById(data.id);

			if (!boardToDeleteResult.isSuccess)
				return Result.Error(boardToDeleteResult.errors);

			const deleteResult = await boardRepository.delete({
				...boardToDeleteResult.value,
			});

			if (!deleteResult.isSuccess) return Result.Error(deleteResult.errors);
			return boardToDeleteResult;
		},
	};
};
