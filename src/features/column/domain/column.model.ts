import { Result } from "@/shared/domain/result";
import { columnValidationErrors } from "./column.errors";

export interface ColumnModel {
	id: string;
	name: string;
	color: string;
	position: number;
	boardId: string;
	taskIds: string[];
}

type ColumnInput = Omit<ColumnModel, "id" | "color"> & {
	id?: ColumnModel["id"];
	color?: ColumnModel["color"];
};

export const Column = (data: ColumnInput): Result<ColumnModel> => {
	if (!data.boardId)
		return Result.Error([
			columnValidationErrors.invalidBoardId(
				data.id ?? "undefined",
				data.boardId,
			),
		]);

	if (!data.name)
		return Result.Error([
			columnValidationErrors.emptyName(data.id ?? "undefined"),
		]);

	if (data.name.length > 100)
		return Result.Error([
			columnValidationErrors.tooLongName(data.id ?? "undefined"),
		]);

	if (isNaN(data.position))
		return Result.Error([
			columnValidationErrors.invalidPosition(
				data.id ?? "undefined",
				data.position,
			),
		]);

	if (data.position < 0)
		return Result.Error([
			columnValidationErrors.negativePosition(
				data.id ?? "undefined",
				data.position,
			),
		]);

	if (
		data.color &&
		!RegExp(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/).test(data.color)
	)
		return Result.Error([
			columnValidationErrors.invalidColor(data.id ?? "undefined", data.color),
		]);

	if (!data.taskIds)
		return Result.Error([
			columnValidationErrors.invalidTaskIds(data.id ?? "undefined"),
		]);

	return Result.Success({
		id: data.id ?? crypto.randomUUID(),
		name: data.name,
		color: data.color ?? "#241890",
		position: data.position ?? 0,
		boardId: data.boardId,
		taskIds: data.taskIds,
	});
};
