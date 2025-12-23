import { ColumnModel } from "@/features/column/domain/column.model";
import { httpClient } from "@/shared/api/api.client";
import { Result } from "@/shared/lib/result";
import { Board, BoardModel } from "../domain/board.domain";
import { IBoardRepository } from "../domain/board.repository";

interface BoardEntity {
	id: string;
	name: string;
	columns: ColumnModel[];
}

interface BoardSummary {
	id: string;
	name: string;
}

export const apiBoardRepository: IBoardRepository = {
	getSummaries: async () => {
		try {
			const response = await httpClient.get<BoardSummary[]>("/boards/summary");
			if (response.data.length === 0) return Result.Success([]);

			const boardModelsMapped: BoardModel[] = [];

			for (const boardSummary of response.data) {
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
		} catch (error) {
			console.error(error);
			return Result.Error([]);
		}
	},

	findById: async (boardId: BoardModel["id"]): Promise<Result<BoardModel>> => {
		try {
			const response = await httpClient.get<BoardEntity>(`/boards/${boardId}`);
			if (!response.data) return Result.Error([]);

			const boardMappedResult = Board({
				id: response.data.id,
				name: response.data.name,
				columns: response.data.columns,
			});
			return boardMappedResult;
		} catch (error) {
			console.error(error);
			return Result.Error([]);
		}
	},

	create: async (data: BoardModel) => {
		try {
			const response = await httpClient.post<BoardEntity>("/boards", data);
			return Board({
				id: response.data.id,
				name: response.data.name,
				columns: response.data.columns,
			});
		} catch (error) {
			console.error(error);
			return Result.Error([]);
		}
	},

	update: async (data: BoardModel) => {
		try {
			const response = await httpClient.put<BoardEntity>("/boards", {
				id: data.id,
				name: data.name,
			});
			const mappedBoard = Board({
				id: response.data.id,
				name: response.data.name,
				columns: data.columns,
			});

			return mappedBoard;
		} catch (error) {
			console.error(error);
			return Result.Error([]);
		}
	},

	delete: async (data: BoardModel) => {
		try {
			const response = await httpClient.delete<string>(`/boars/${data.id}`);
			return response.data ? Result.Success(response.data) : Result.Error([]);
		} catch (error) {
			console.error(error);
			return Result.Error([]);
		}
	},
};
