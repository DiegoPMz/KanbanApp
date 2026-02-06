import { Result } from "@/shared/domain/result";
import { taskValidationErrors } from "./task.errors";

export const TASK_PRIORITIES = {
	LOW: "low",
	MEDIUM: "medium",
	HIGH: "high",
} as const;

export type TaskPriorities =
	(typeof TASK_PRIORITIES)[keyof typeof TASK_PRIORITIES];

export interface TaskModel {
	columnId: string;
	id: string;
	title: string;
	description: string;
	isCompleted: boolean;
	position: number;
	priority: TaskPriorities;
	subtaskIds: string[];
}

type TaskInput = Omit<TaskModel, "id"> & {
	id?: TaskModel["id"];
};

export const Task = (data: TaskInput): Result<TaskModel> => {
	if (!data.columnId)
		return Result.Failure([
			taskValidationErrors.invalidColumnId(data.columnId, data.id),
		]);

	if (!data.title)
		return Result.Failure([taskValidationErrors.emptyTitle(data.id)]);

	if (data.title.length > 200)
		return Result.Failure([
			taskValidationErrors.tooLongTitle(data.title.length, data.id),
		]);

	if (isNaN(data.position))
		return Result.Failure([
			taskValidationErrors.invalidPosition(data.position, data.id),
		]);

	if (data.position < 0)
		return Result.Failure([
			taskValidationErrors.negativePosition(data.position, data.id),
		]);

	if (Object.values(TASK_PRIORITIES).indexOf(data.priority) === -1)
		return Result.Failure([
			taskValidationErrors.invalidPriority(data.priority, data.id),
		]);

	if (!data.subtaskIds)
		return Result.Failure([taskValidationErrors.invalidSubtaskIds(data.id)]);

	return Result.Success({
		columnId: data.columnId,
		id: data.id ?? crypto.randomUUID(),
		title: data.title,
		description: data.description,
		isCompleted: data.isCompleted,
		position: data.position,
		priority: data.priority,
		subtaskIds: data.subtaskIds,
	});
};
