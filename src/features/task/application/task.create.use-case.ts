import { Task } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";

export interface CreateTaskDto {
	columnId: string;
	title: string;
	description: string;
	isCompleted: boolean;
	position: number;
	priority: string;
}

export const createTask = (taskRepository: ITaskRepository) => {
	return {
		handle: async (data: CreateTaskDto) => {
			const taskCreatedResult = Task({
				columnId: data.columnId,
				title: data.title,
				description: data.description,
				isCompleted: data.isCompleted,
				position: data.position,
				priority: data.priority,
				subtasks: [],
			});

			if (!taskCreatedResult.isSuccess) return taskCreatedResult;

			const taskSavedResult = await taskRepository.create(
				taskCreatedResult.value,
			);
			if (!taskSavedResult.isSuccess) return taskSavedResult;

			return taskSavedResult;
		},
	};
};
