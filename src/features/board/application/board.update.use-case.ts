import { Result } from "@/shared/domain/result";
import { Board, BoardModel } from "../domain/board.model";
import { IBoardRepository } from "./../domain/board.repository";

export interface UpdateBoardDto {
	id: BoardModel["id"];
	name: string;
}

export const updateBoard = (boardRepository: IBoardRepository) => {
	return {
		handle: async (data: UpdateBoardDto): Promise<Result<BoardModel>> => {
			const boardFoundedResult = await boardRepository.findById(data.id);
			if (!boardFoundedResult.isSuccess)
				return Result.Error(boardFoundedResult.errors);

			const boardUpdatedResult = Board({
				id: boardFoundedResult.value.id,
				columnIds: boardFoundedResult.value.columnIds,
				name: data.name,
			});

			return boardUpdatedResult.isSuccess
				? boardRepository.update(boardUpdatedResult.value)
				: Result.Error(boardUpdatedResult.errors);
		},
	};
};
