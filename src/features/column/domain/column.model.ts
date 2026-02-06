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
		return Result.Failure([
			columnValidationErrors.invalidBoardId(data.boardId, data.id),
		]);

	if (!data.name)
		return Result.Failure([columnValidationErrors.emptyName(data.id)]);

	if (data.name.length > 100)
		return Result.Failure([
			columnValidationErrors.tooLongName(data.name.length, data.id),
		]);

	if (isNaN(data.position))
		return Result.Failure([
			columnValidationErrors.invalidPosition(data.position, data.id),
		]);

	if (data.position < 0)
		return Result.Failure([
			columnValidationErrors.negativePosition(data.position, data.id),
		]);

	if (
		data.color &&
		!RegExp(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/).test(data.color)
	)
		return Result.Failure([
			columnValidationErrors.invalidColor(data.color, data.id),
		]);

	if (!data.taskIds)
		return Result.Failure([columnValidationErrors.invalidTaskIds(data.id)]);

	return Result.Success({
		id: data.id ?? crypto.randomUUID(),
		name: data.name,
		color: data.color ?? "#241890",
		position: data.position ?? 0,
		boardId: data.boardId,
		taskIds: data.taskIds,
	});
};
