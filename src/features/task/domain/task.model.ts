import { ColumnModel } from "@/features/column";
import { Result } from "@/shared/lib/result";

export interface TaskModel {
	columnId: ColumnModel["id"];
	id: string;
	title: string;
	description: string;
	isCompleted: boolean;
	position: number;
	priority: string;
	subtasks: SubtaskModel[];
}

type TaskInput = Omit<TaskModel, "id"> & {
	id?: TaskModel["id"];
};

export const Task = (data: TaskInput): Result<TaskModel> => {
	return Result.Success({
		columnId: data.columnId,
		id: data.id ?? crypto.randomUUID(),
		title: data.title,
		description: data.description,
		isCompleted: data.isCompleted,
		position: data.position,
		priority: data.priority,
		subtasks: data.subtasks ?? [],
	});
};

interface SubtaskModel {
	taskId: TaskModel["id"];
	id: string;
	description: string;
	isCompleted: boolean;
}
