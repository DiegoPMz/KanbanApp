import { Result } from "@/shared/lib/result";
import { BoardFullDetailsModel } from "./board.board-full-details.model";
import { BoardModel } from "./board.model";

export interface IBoardRepository {
	findPaginated: (page: number, limit: number) => Promise<Result<BoardModel[]>>;
	findById: (boardId: BoardModel["id"]) => Promise<Result<BoardModel>>;
	create: (data: BoardModel) => Promise<Result<BoardModel>>;
	update: (data: BoardModel) => Promise<Result<BoardModel>>;
	delete: (data: BoardModel) => Promise<Result<string>>;
	getBoardDetails: (id: string) => Promise<Result<BoardFullDetailsModel>>;
}
