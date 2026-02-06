import { Result } from "@/shared/domain/result";
import { SubTaskModel } from "../domain/subTask.model";
import { ISubTaskRepository } from "../domain/subTask.repository";

export interface DeleteSubTaskDto {
	id: string;
}

export const deleteSubTask = (subTaskRepository: ISubTaskRepository) => {
	return {
		handle: async (data: DeleteSubTaskDto): Promise<Result<SubTaskModel>> => {
			const subTaskFoundedResult = await subTaskRepository.findById(data.id);
			if (!subTaskFoundedResult.isSuccess) return subTaskFoundedResult;

			const subTaskDeletedResult = await subTaskRepository.delete(
				subTaskFoundedResult.value,
			);

			return subTaskDeletedResult.isSuccess
				? subTaskFoundedResult
				: Result.Failure(subTaskDeletedResult.errors);
		},
	};
};
