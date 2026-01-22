import { Result } from "@/shared/domain/result";
import { subTaskValidationError } from "./subTask.errors";

export interface SubTaskModel {
	id: string;
	taskId: string;
	description: string;
	isCompleted: boolean;
}

type SubTaskInput = Omit<SubTaskModel, "id"> & {
	id?: SubTaskModel["id"];
};

export const SubTask = (data: SubTaskInput): Result<SubTaskModel> => {
	if (!data.taskId)
		return Result.Error([
			subTaskValidationError.invalidTaskId(data.id ?? "undefined"),
		]);

	if (!data.description)
		return Result.Error([
			subTaskValidationError.emptyDescription(data.id ?? "undefined"),
		]);

	if (data.description.length > 500)
		return Result.Error([
			subTaskValidationError.tooLongDescription(data.id ?? "undefined"),
		]);

	if (typeof data.isCompleted !== "boolean") {
		return Result.Error([
			subTaskValidationError.invalidIsCompleted(data.id ?? "undefined"),
		]);
	}

	return Result.Success({
		id: data.id ?? crypto.randomUUID(),
		taskId: data.taskId,
		description: data.description,
		isCompleted: data.isCompleted,
	});
};
