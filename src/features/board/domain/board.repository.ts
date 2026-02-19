import { PaginatedResponse } from "@/shared/domain/paginated-response.read-model";
import { Pagination } from "@/shared/domain/pagination.value-object";
import { Result } from "@/shared/domain/result";
import { BoardFullDetailsModel } from "./board.board-full-details.read-model";
import { BoardModel } from "./board.model";

export interface IBoardRepository {
	search: (
		pagination: Pagination,
	) => Promise<Result<PaginatedResponse<BoardModel>>>;
	findById: (boardId: BoardModel["id"]) => Promise<Result<BoardModel>>;
	create: (data: BoardModel) => Promise<Result<BoardModel>>;
	update: (data: BoardModel) => Promise<Result<BoardModel>>;
	delete: (data: BoardModel) => Promise<Result<string>>;
	getBoardDetails: (id: string) => Promise<Result<BoardFullDetailsModel>>;
}
