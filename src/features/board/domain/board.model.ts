import { Result } from "@/shared/domain/result";
import { boardValidationErrors } from "./board.errors";

export interface BoardModel {
	id: string;
	name: string;
	columnIds: string[];
}

type BoardInput = Omit<BoardModel, "id"> & { id?: BoardModel["id"] };

export const Board = (data: BoardInput): Result<BoardModel> => {
	if (!data.name) return Result.Failure([boardValidationErrors.emptyName()]);

	if (data.name.length > 100)
		return Result.Failure([
			boardValidationErrors.tooLongName(data.name.length, data.id),
		]);

	if (!data.columnIds)
		return Result.Failure([boardValidationErrors.invalidColumnIds(data.id)]);

	return Result.Success({
		id: data.id ?? crypto.randomUUID(),
		name: data.name,
		columnIds: data.columnIds,
	});
};
