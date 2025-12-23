import { Result } from "@/shared/lib/result";
import { BoardModel } from "./board.domain";

export interface IBoardRepository {
	getSummaries: () => Promise<Result<BoardModel[]>>;
	findById: (boardId: BoardModel["id"]) => Promise<Result<BoardModel>>;
	create: (data: BoardModel) => Promise<Result<BoardModel>>;
	update: (data: BoardModel) => Promise<Result<BoardModel>>;
	delete: (data: BoardModel) => Promise<Result<string>>;
}
