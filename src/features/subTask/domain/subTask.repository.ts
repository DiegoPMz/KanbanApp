import { Result } from "@/shared/domain/result";
import { SubTaskModel } from "./subTask.model";

export interface ISubTaskRepository {
	findById: (subTaskId: SubTaskModel["id"]) => Promise<Result<SubTaskModel>>;
	create: (data: SubTaskModel) => Promise<Result<SubTaskModel>>;
	update: (data: SubTaskModel) => Promise<Result<SubTaskModel>>;
	delete: (data: SubTaskModel) => Promise<Result<string>>;
}
