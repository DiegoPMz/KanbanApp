import { Result } from "@/shared/domain/result";
import { Task, TaskModel, TaskPriorities } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";

export interface CreateTaskDto {
	columnId: string;
	title: string;
	description: string;
	isCompleted: boolean;
	position: number;
	priority: TaskPriorities;
}

export const createTask = (taskRepository: ITaskRepository) => {
	return {
		handle: async (data: CreateTaskDto): Promise<Result<TaskModel>> => {
			const taskCreatedResult = Task({
				columnId: data.columnId,
				title: data.title,
				description: data.description,
				isCompleted: data.isCompleted,
				position: data.position,
				priority: data.priority,
				subtaskIds: [],
			});

			return taskCreatedResult.isSuccess
				? taskRepository.create(taskCreatedResult.value)
				: taskCreatedResult;
		},
	};
};
