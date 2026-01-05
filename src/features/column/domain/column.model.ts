import { TaskModel } from "@/features/task";
import { Result } from "@/shared/lib/result";
import {
	columnBoardIdErrors,
	columnNameErrors,
	columnPositionErrors,
} from "./column.errors";

export interface ColumnModel {
	id: string;
	name: string;
	color: string;
	position: number;
	boardId: string;
	tasks: TaskModel[];
}

type ColumnInput = Omit<ColumnModel, "id" | "color"> & {
	id?: ColumnModel["id"];
	color?: ColumnModel["color"];
};

export const Column = (data: ColumnInput): Result<ColumnModel> => {
	if (!data.boardId)
		return Result.Error([
			{
				code: columnBoardIdErrors.code,
				message: columnBoardIdErrors.messages.empty,
			},
		]);

	if (!data.name)
		return Result.Error([
			{ code: columnNameErrors.code, message: columnNameErrors.messages.empty },
		]);

	if (data.position < 0) {
		return Result.Error([
			{
				code: columnPositionErrors.code,
				message: columnPositionErrors.messages.negative,
			},
		]);
	}

	return Result.Success({
		id: data.id ?? crypto.randomUUID(),
		name: data.name,
		color: data.color ?? "#241890",
		position: data.position ?? 0,
		boardId: data.boardId,
		tasks: data.tasks ?? [],
	});
};
