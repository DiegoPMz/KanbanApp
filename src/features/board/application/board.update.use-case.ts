import { Result } from "@/shared/lib/result";
import { BoardModel } from "../domain/board.domain";
import { IBoardRepository } from "./../domain/board.repository";

export interface UpdateBoardDto {
	id: BoardModel["id"];
	name: string;
}

export const updateBoard = (boardRepository: IBoardRepository) => {
	return {
		handle: async (data: UpdateBoardDto): Promise<Result<BoardModel>> => {
			if (!data.name) return Result.Error([]);

			const boardToUpdateResult = await boardRepository.findById(data.id);
			if (!boardToUpdateResult.isSuccess)
				return Result.Error([...boardToUpdateResult.errors]);

			return boardRepository.update({
				...boardToUpdateResult.value,
				name: data.name,
			});
		},
	};
};
