import { Result } from "@/shared/domain/result";
import { Board, BoardModel } from "../domain/board.model";
import { IBoardRepository } from "./../domain/board.repository";

export interface CreateBoardDto {
	name: string;
}

export const createBoard = (boardRepository: IBoardRepository) => {
	return {
		handle: async (data: CreateBoardDto): Promise<Result<BoardModel>> => {
			if (!data.name) return Result.Failure([]);

			const boardCreatedResult = Board({
				name: data.name,
				columnIds: [],
			});

			return boardCreatedResult.isSuccess
				? boardRepository.create(boardCreatedResult.value)
				: boardCreatedResult;
		},
	};
};
