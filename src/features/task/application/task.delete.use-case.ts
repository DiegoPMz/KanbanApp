import { Result } from "@/shared/lib/result";
import { TaskModel } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";

export interface DeleteTaskDto {
	id: string;
}

export const deleteTask = (taskRepository: ITaskRepository) => {
	return {
		handle: async (data: DeleteTaskDto) => {
			const taskFoundedResult = await taskRepository.findById(data.id);
			if (!taskFoundedResult.isSuccess) return taskFoundedResult;

			const taskDeletedResult = await taskRepository.delete(
				taskFoundedResult.value,
			);

			return taskDeletedResult.isSuccess
				? taskFoundedResult
				: Result.Error<TaskModel>(taskDeletedResult.errors);
		},
	};
};
