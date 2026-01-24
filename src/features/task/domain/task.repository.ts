import { Result } from "@/shared/domain/result";
import { TaskModel } from "./task.model";

export interface ITaskRepository {
	findById: (taskId: TaskModel["id"]) => Promise<Result<TaskModel>>;
	create: (data: TaskModel) => Promise<Result<TaskModel>>;
	update: (data: TaskModel) => Promise<Result<TaskModel>>;
	delete: (data: TaskModel) => Promise<Result<string>>;
	reorder: (data: TaskModel) => Promise<Result<TaskModel[]>>;
}
