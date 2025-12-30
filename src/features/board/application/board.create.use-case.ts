import { columnNameErrors } from "@/features/column/domain/column.errors";
import { Column } from "@/features/column/domain/column.model";
import { Result } from "@/shared/lib/result";
import { Board, BoardModel } from "../domain/board.domain";
import { IBoardRepository } from "./../domain/board.repository";

export interface CreateBoardDto {
	name: string;
	columns: {
		name: string;
	}[];
}

export const createBoard = (boardRepository: IBoardRepository) => {
	return {
		handle: async (data: CreateBoardDto): Promise<Result<BoardModel>> => {
			if (!data.name) return Result.Error([]);

			const boardModelResult = Board({
				name: data.name,
				columns: [],
			});

			if (!boardModelResult.isSuccess)
				return Result.Error([...boardModelResult.errors]);

			const columnResults = data.columns.map((c, index) =>
				Column({
					name: c.name,
					boardId: boardModelResult.value.id,
					position: index,
					tasks: [],
				}),
			);

			const firstError = columnResults.find((r) => !r.isSuccess);
			if (firstError) return Result.Error([...firstError.errors]);

			const columns = columnResults.map((r) => r.value);
			const hasDuplicates =
				new Set(columns.map((c) => c.name)).size !== columns.length;
			if (hasDuplicates)
				return Result.Error([
					{
						code: columnNameErrors.code,
						message: "Column names must be unique.",
					},
				]);

			const boardToPersist = Board({ ...boardModelResult.value, columns });
			if (!boardToPersist.isSuccess)
				return Result.Error([...boardToPersist.errors]);

			return boardRepository.create(boardToPersist.value);
		},
	};
};
