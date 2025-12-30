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

interface CreateBoardRequest {
	boards: {
		name: string;
		columns: {
			name: string;
			color: string;
		}[];
	}[];
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
			const res = await httpClient.get<BoardEntity>(`/boards/${boardId}`);
			return Board({
				id: res.data.id,
				name: res.data.name,
				columns: res.data.columns,
			});
		} catch {
			return Result.Error([]);
		}
	},

	create: async (data: BoardModel): Promise<Result<BoardModel>> => {
		const createBoardContent: CreateBoardRequest = {
			boards: [
				{
					name: data.name,
					columns: data.columns.map((c) => ({
						name: c.name,
						color: c.color,
					})),
				},
			],
		};

		try {
			const res = await httpClient.post<BoardEntity>(
				"/boards",
				createBoardContent,
			);
			return Board({
				id: res.data.id,
				name: res.data.name,
				columns: res.data.columns,
			});
		} catch {
			return Result.Error([]);
		}
	},

	update: async (data: BoardModel): Promise<Result<BoardModel>> => {
		try {
			const res = await httpClient.put<BoardEntity>("/boards", {
				id: data.id,
				name: data.name,
			});
			return Board({
				id: res.data.id,
				name: res.data.name,
				columns: res.data.columns,
			});
		} catch {
			return Result.Error([]);
		}
	},

	delete: async (data: BoardModel) => {
		try {
			const response = await httpClient.delete<string>(`/boars/${data.id}`);
			return response.data ? Result.Success(response.data) : Result.Error([]);
		} catch {
			return Result.Error([]);
		}
	},
};
