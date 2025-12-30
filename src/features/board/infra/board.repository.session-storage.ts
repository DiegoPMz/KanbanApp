import { Result } from "@/shared/lib/result";
import z from "zod";
import { IBoardRepository } from "../domain/board.repository";
import { Board, BoardModel } from "./../domain/board.domain";

const BOARD_STORAGE_KEY = "DEMO_KANBAN_BOARD";

export const sessionStorageBoardRepository: IBoardRepository = {
	getSummaries: async () => {
		const boardsRawCollection = sessionStorage.getItem(BOARD_STORAGE_KEY);
		if (!boardsRawCollection) return Result.Error<BoardModel[]>([]);

		const persistedBoards =
			parseData<BoardEntityCollection>(boardsRawCollection);

		if (!persistedBoards) return Result.Error<BoardModel[]>([]);

		const boardModelsMapped: BoardModel[] = [];

		for (const boardSummary of persistedBoards) {
			const boardModelResult = Board({
				id: boardSummary.id,
				name: boardSummary.name,
				columns: [],
			});

			if (!boardModelResult.isSuccess) {
				console.error(`invalid board`);
				continue;
			}

			boardModelsMapped.push(boardModelResult.value);
		}

		return Result.Success(boardModelsMapped);
	},

	findById: async (boardId: BoardModel["id"]): Promise<Result<BoardModel>> => {
		const boardCollectionResult = await getBoardCollection();
		if (!boardCollectionResult.isSuccess) return Result.Error<BoardModel>([]);

		const foundedBoard = boardCollectionResult.value.find(
			(b) => b.id === boardId,
		);
		if (!foundedBoard) return Result.Error<BoardModel>([]);

		return Result.Success(foundedBoard);
	},

	create: async (data: BoardModel) => {
		const boardCollectionResult = await getBoardCollection();
		if (!boardCollectionResult.isSuccess) return Result.Error<BoardModel>([]);

		const newBoard = Board({
			id: data.id,
			name: data.name,
			columns: data.columns,
		});

		if (!newBoard.isSuccess) return Result.Error<BoardModel>([]);

		sessionStorage.setItem(
			BOARD_STORAGE_KEY,
			JSON.stringify([...boardCollectionResult.value, newBoard.value]),
		);

		return Result.Success(newBoard.value);
	},

	update: async (data: BoardModel) => {
		const boardCollectionResult = await getBoardCollection();
		if (!boardCollectionResult.isSuccess) return Result.Error<BoardModel>([]);

		const collectionUpdated = boardCollectionResult.value.map((b) =>
			b.id === data.id ? { ...b, name: data.name } : b,
		);

		sessionStorage.setItem(
			BOARD_STORAGE_KEY,
			JSON.stringify(collectionUpdated),
		);

		const boardUpdated = boardCollectionResult.value.find(
			(b) => b.id === data.id,
		);

		return !boardUpdated ? Result.Error([]) : Result.Success(boardUpdated);
	},

	delete: async (data: BoardModel) => {
		const boardCollectionResult = await getBoardCollection();
		if (!boardCollectionResult.isSuccess) return Result.Error<string>([]);

		const collectionUpdated = boardCollectionResult.value.filter(
			(b) => b.id !== data.id,
		);

		sessionStorage.setItem(
			BOARD_STORAGE_KEY,
			JSON.stringify(collectionUpdated),
		);

		return Result.Success("Board deleted successfully");
	},
};

const boardEntitySchema = z.object({
	id: z.uuid(),
	name: z.string(),
});

const boardEntityCollectionSchema = z.array(boardEntitySchema);
type BoardEntityCollection = z.infer<typeof boardEntityCollectionSchema>;

async function getBoardCollection() {
	const boardsRawCollection = sessionStorage.getItem(BOARD_STORAGE_KEY);
	if (!boardsRawCollection) return Result.Error<BoardModel[]>([]);

	const persistedBoards = parseData<BoardEntityCollection>(boardsRawCollection);
	if (!persistedBoards) return Result.Error<BoardModel[]>([]);

	const boardsValidation =
		await boardEntityCollectionSchema.safeParseAsync(persistedBoards);

	if (!boardsValidation.success) return Result.Error<BoardModel[]>([]);

	const boardModelsMapped: BoardModel[] = [];

	for (const boardSummary of boardsValidation.data) {
		const boardModelResult = Board({
			id: boardSummary.id,
			name: boardSummary.name,
			columns: [],
		});

		if (!boardModelResult.isSuccess) {
			console.error(`invalid board`);
			continue;
		}

		boardModelsMapped.push(boardModelResult.value);
	}

	return Result.Success(boardModelsMapped);
}

function parseData<D>(data: string) {
	try {
		return JSON.parse(data) as D;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return null;
	}
}
