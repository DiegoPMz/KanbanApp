import { Result } from "@/shared/domain/result";
import { taskValidationError } from "./task.errors";

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
		return Result.Error([
			taskValidationError.invalidColumnId(data.id ?? "NEW_TASK"),
		]);

	if (!data.title)
		return Result.Error([
			taskValidationError.emptyTitle(data.id ?? "NEW_TASK"),
		]);

	if (data.title.length > 200)
		return Result.Error([
			taskValidationError.tooLongTitle(data.id ?? "NEW_TASK"),
		]);

	if (isNaN(data.position))
		return Result.Error([
			taskValidationError.invalidPosition(data.id ?? "NEW_TASK", data.position),
		]);

	if (data.position < 0)
		return Result.Error([
			taskValidationError.negativePosition(
				data.id ?? "NEW_TASK",
				data.position,
			),
		]);

	if (Object.values(TASK_PRIORITIES).indexOf(data.priority) === -1)
		return Result.Error([
			taskValidationError.invalidPriority(data.id ?? "NEW_TASK", data.priority),
		]);

	if (!data.subtaskIds)
		return Result.Error([
			taskValidationError.invalidSubtaskIds(data.id ?? "NEW_TASK"),
		]);

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
