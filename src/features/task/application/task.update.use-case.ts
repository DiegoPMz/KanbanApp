import { Task } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";

export interface UpdateTaskDto {
	id: string;
	title?: string;
	description?: string;
	isCompleted?: boolean;
	priority?: string;
}

export const updateTask = (taskRepository: ITaskRepository) => {
	return {
		handle: async (data: UpdateTaskDto) => {
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

			if (!taskUpdatedResult.isSuccess) return taskUpdatedResult;
			return taskRepository.update(taskUpdatedResult.value);
		},
	};
};
