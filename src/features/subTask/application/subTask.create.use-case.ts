import { Result } from "@/shared/lib/result";
import { SubTask, SubTaskModel } from "../domain/subTask.model";
import { ISubTaskRepository } from "../domain/subTask.repository";

export interface CreateSubTaskDto {
	taskId: string;
	description: string;
	isCompleted?: boolean;
}

export const createSubTask = (subTaskRepository: ISubTaskRepository) => {
	return {
		handle: async (data: CreateSubTaskDto): Promise<Result<SubTaskModel>> => {
			const subTaskCreatedResult = SubTask({
				taskId: data.taskId,
				description: data.description,
				isCompleted: data.isCompleted === undefined ? false : data.isCompleted,
			});

			return subTaskCreatedResult.isSuccess
				? subTaskRepository.create(subTaskCreatedResult.value)
				: subTaskCreatedResult;
		},
	};
};
