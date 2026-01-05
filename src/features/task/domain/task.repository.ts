import { Result } from "@/shared/lib/result";
import { TaskModel } from "./task.model";

export interface ITaskRepository {
	findById: (columnId: TaskModel["id"]) => Promise<Result<TaskModel>>;
	create: (data: TaskModel) => Promise<Result<TaskModel>>;
	update: (data: TaskModel) => Promise<Result<TaskModel>>;
	delete: (data: TaskModel) => Promise<Result<string>>;
	reorder: (data: TaskModel) => Promise<Result<TaskModel[]>>;
}
