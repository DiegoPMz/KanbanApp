import { Result } from "@/shared/domain/result";
import { BoardModel } from "../domain/board.model";
import { IBoardRepository } from "../domain/board.repository";
import { PaginatedResponse } from "@/shared/domain/paginated-response.read-model";
import { Pagination } from "@/shared/domain/pagination.value-object";

export interface BoardListDto {
	limit: number;
	cursor?: string;
}

export const boardList = (boardRepository: IBoardRepository) => {
	return {
		handle: async (
			dto: BoardListDto,
		): Promise<Result<PaginatedResponse<BoardModel>>> => {
			const paginationResult = Pagination.create(dto.limit, dto.cursor);
			if (!paginationResult.isSuccess)
				return Result.Failure(paginationResult.errors);

			return await boardRepository.search(paginationResult.value);
		},
	};
};
