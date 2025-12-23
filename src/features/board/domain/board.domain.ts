import { ColumnModel } from "@/features/column/domain/column.model";
import { Result } from "@/shared/lib/result";
import { boardColumnsErrors, boardNameErrors } from "./board.errors";

export interface BoardModel {
	id: string;
	name: string;
	columns: ColumnModel[];
}

type BoardInput = Omit<BoardModel, "id"> & { id?: BoardModel["id"] };

export const Board = (data: BoardInput): Result<BoardModel> => {
	if (!data.name)
		return Result.Error([
			{
				code: boardNameErrors.code,
				message: boardNameErrors.messages.empty,
				details: { name: data.name, id: data.id },
			},
		]);

	if (!data.columns)
		return Result.Error([
			{
				code: boardColumnsErrors.code,
				message: boardColumnsErrors.messages.invalid,
				details: { columns: data.columns, id: data.id },
			},
		]);

	return Result.Success({
		id: data.id ?? crypto.randomUUID(),
		name: data.name,
		columns: data.columns,
	});
};
