import { Result } from "@/shared/domain/result";
import { subTaskValidationErrors } from "./subTask.errors";

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
		return Result.Failure([
			subTaskValidationErrors.invalidTaskId(data.taskId, data.id),
		]);

	if (!data.description)
		return Result.Failure([subTaskValidationErrors.emptyDescription(data.id)]);

	if (data.description.length > 500)
		return Result.Failure([
			subTaskValidationErrors.tooLongDescription(
				data.description.length,
				data.id,
			),
		]);

	if (typeof data.isCompleted !== "boolean") {
		return Result.Failure([
			subTaskValidationErrors.invalidIsCompleted(data.id),
		]);
	}

	return Result.Success({
		id: data.id ?? crypto.randomUUID(),
		taskId: data.taskId,
		description: data.description,
		isCompleted: data.isCompleted,
	});
};
