import { Result } from "@/shared/lib/result";
import { BoardModel } from "../domain/board.model";
import { IBoardRepository } from "../domain/board.repository";

export interface GetBoardsPaginatedDto {
	page: number;
	limit: number;
}

export const getBoardsPaginated = (boardRepository: IBoardRepository) => {
	return {
		handle: async (
			data: GetBoardsPaginatedDto,
		): Promise<Result<BoardModel[]>> => {
			if (data.limit < 1) return Result.Error([]);
			return boardRepository.findPaginated(data.page, data.limit);
		},
	};
};
