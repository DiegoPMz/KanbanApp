import { Result } from "@/shared/lib/result";
import { boardValidationErrors } from "./board.errors";

export interface BoardModel {
	id: string;
	name: string;
	columnIds: string[];
}

type BoardInput = Omit<BoardModel, "id"> & { id?: BoardModel["id"] };

export const Board = (data: BoardInput): Result<BoardModel> => {
	if (!data.name)
		return Result.Error([
			boardValidationErrors.emptyName(data.id ?? "undefined"),
		]);

	if (data.name.length > 100)
		return Result.Error([
			boardValidationErrors.tooLongName(data.id ?? "undefined"),
		]);

	if (!data.columnIds)
		return Result.Error([
			boardValidationErrors.invalidColumnIds(data.id ?? "undefined"),
		]);

	return Result.Success({
		id: data.id ?? crypto.randomUUID(),
		name: data.name,
		columnIds: data.columnIds,
	});
};
