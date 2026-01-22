import { Result } from "@/shared/domain/result";
import { SubTask, SubTaskModel } from "../domain/subTask.model";
import { ISubTaskRepository } from "../domain/subTask.repository";

export interface UpdateSubTaskDto {
	id: string;
	description?: string;
	isCompleted?: boolean;
}

export const updateSubTask = (subTaskRepository: ISubTaskRepository) => {
	return {
		handle: async (data: UpdateSubTaskDto): Promise<Result<SubTaskModel>> => {
			const subTaskFoundedResult = await subTaskRepository.findById(data.id);
			if (!subTaskFoundedResult.isSuccess) return subTaskFoundedResult;

			const subTaskUpdatedResult = SubTask({
				...subTaskFoundedResult.value,
				description: data.description ?? subTaskFoundedResult.value.description,
				isCompleted:
					data.isCompleted === undefined
						? subTaskFoundedResult.value.isCompleted
						: data.isCompleted,
			});

			return subTaskUpdatedResult.isSuccess
				? subTaskRepository.update(subTaskUpdatedResult.value)
				: subTaskUpdatedResult;
		},
	};
};
