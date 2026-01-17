import { Result } from "@/shared/lib/result";
import { SubTaskModel } from "../domain/subTask.model";
import { ISubTaskRepository } from "../domain/subTask.repository";
import { apiSubTaskRepository } from "./subTask.repository.api";

export const StateSubTaskRepository = (
	baseSubTaskRepository = apiSubTaskRepository,
): ISubTaskRepository => ({
	...baseSubTaskRepository,
	findById: async (
		subTaskId: SubTaskModel["id"],
	): Promise<Result<SubTaskModel>> => {
		return baseSubTaskRepository.findById(subTaskId);
	},
});
