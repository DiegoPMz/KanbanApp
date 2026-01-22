import { Result } from "@/shared/domain/result";
import { Task, TaskModel, TaskPriorities } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";

export interface UpdateTaskDto {
	id: string;
	title?: string;
	description?: string;
	isCompleted?: boolean;
	priority?: TaskPriorities;
}

export const updateTask = (taskRepository: ITaskRepository) => {
	return {
		handle: async (data: UpdateTaskDto): Promise<Result<TaskModel>> => {
			const taskFoundedResult = await taskRepository.findById(data.id);
			if (!taskFoundedResult.isSuccess) return taskFoundedResult;

			const taskUpdatedResult = Task({
				...taskFoundedResult.value,
				title: data.title ?? taskFoundedResult.value.title,
				description: data.description ?? taskFoundedResult.value.description,
				isCompleted:
					data.isCompleted !== undefined
						? data.isCompleted
						: taskFoundedResult.value.isCompleted,
				priority: data.priority ?? taskFoundedResult.value.priority,
			});

			return taskUpdatedResult.isSuccess
				? taskRepository.update(taskUpdatedResult.value)
				: taskUpdatedResult;
		},
	};
};
