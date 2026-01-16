import { Result } from "@/shared/lib/result";
import { Task, TaskModel } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";

export interface ReorderTaskDto {
	id: string;
	position: number;
}

export const reorderTask = (taskRepository: ITaskRepository) => {
	return {
		handle: async (data: ReorderTaskDto): Promise<Result<TaskModel[]>> => {
			const taskFoundedResult = await taskRepository.findById(data.id);
			if (!taskFoundedResult.isSuccess)
				return Result.Error(taskFoundedResult.errors);

			const taskReorderedResult = Task({
				...taskFoundedResult.value,
				position: data.position,
			});

			return taskReorderedResult.isSuccess
				? taskRepository.reorder(taskReorderedResult.value)
				: Result.Error(taskReorderedResult.errors);
		},
	};
};
