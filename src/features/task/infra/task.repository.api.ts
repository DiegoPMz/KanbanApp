import { httpClient } from "@/shared/api/api.client";
import { Result } from "@/shared/lib/result";
import { AxiosResponse } from "axios";
import { Task, TaskModel } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";

interface TaskEntity {
	columnId: string;
	id: string;
	title: string;
	description: string;
	isCompleted: boolean;
	position: number;
	priority: string;
	subtasks: [];
}

type CreateTaskRequest = Omit<TaskEntity, "id" | "subtasks">;
interface UpdateTaskRequest {
	id: string;
	title?: string;
	description?: string;
	columnId?: string;
	isCompleted?: boolean;
	priority?: string;
}

interface ReorderBody {
	columnId: string;
	id: string;
	position: number;
}

export const apiTaskRepository: ITaskRepository = {
	findById: async (taskId: TaskModel["id"]): Promise<Result<TaskModel>> => {
		try {
			const res = await httpClient.get<TaskEntity>(`/boardTasks/${taskId}`);
			return toTask(res.data);
		} catch {
			return Result.Error([]);
		}
	},

	create: async (data: TaskModel): Promise<Result<TaskModel>> => {
		const createTask: CreateTaskRequest = {
			columnId: data.columnId,
			title: data.title,
			description: data.description,
			isCompleted: data.isCompleted,
			position: data.position,
			priority: data.priority,
		};

		try {
			const res = await httpClient.post<TaskEntity>("/boardTasks", createTask);
			return toTask(res.data);
		} catch {
			return Result.Error([]);
		}
	},

	update: async (data: TaskModel): Promise<Result<TaskModel>> => {
		try {
			const res = await httpClient.put<
				TaskEntity,
				AxiosResponse<TaskEntity>,
				UpdateTaskRequest
			>("/boardTasks", {
				columnId: data.columnId,
				id: data.id,
				title: data.title,
				description: data.description,
				isCompleted: data.isCompleted,
				priority: data.priority,
			});

			return toTask(res.data);
		} catch {
			return Result.Error([]);
		}
	},

	delete: async (data: TaskModel) => {
		try {
			const res = await httpClient.delete<string>(`/boardTasks/${data.id}`);
			return res.data ? Result.Success(res.data) : Result.Error([]);
		} catch {
			return Result.Error([]);
		}
	},

	reorder: async (data: TaskModel) => {
		try {
			const res = await httpClient.put<
				TaskModel[],
				AxiosResponse<TaskModel[]>,
				ReorderBody
			>(`/boardTasks/reorder`, {
				columnId: data.columnId,
				id: data.id,
				position: data.position,
			});
			return res.data ? Result.Success(res.data) : Result.Error([]);
		} catch {
			return Result.Error([]);
		}
	},
};

const toTask = (model: TaskEntity) =>
	Task({
		columnId: model.columnId,
		id: model.id,
		title: model.title,
		description: model.description,
		isCompleted: model.isCompleted,
		position: model.position,
		priority: model.priority,
		subtasks: model.subtasks,
	});
