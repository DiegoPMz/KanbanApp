import { httpClient } from "@/shared/api/api.client";
import { ProblemDetails } from "@/shared/api/http-error.interceptor";
import { AppError, Result } from "@/shared/lib/result";
import { AxiosError, AxiosResponse, HttpStatusCode } from "axios";
import {
	taskPersistenceErrors,
	taskValidationError,
} from "../domain/task.errors";
import { Task, TaskModel } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";

interface TaskApiDto {
	columnId: string;
	id: string;
	title: string;
	description: string;
	isCompleted: boolean;
	position: number;
	priority: "low" | "medium" | "high";
}

type CreateTaskRequest = Omit<TaskApiDto, "id">;

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
			const res = await httpClient.get<TaskApiDto>(`/boardTasks/${taskId}`);
			return toTask(res.data);
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ProblemDetails;

				if (response.status === HttpStatusCode.NotFound)
					return Result.Error([taskPersistenceErrors.notFound(taskId)]);

				if (response.status === HttpStatusCode.BadRequest)
					return Result.Error([taskValidationError.invalidId(taskId)]);
			}

			return Result.Error([
				taskPersistenceErrors.dataNotFound("UNDEFINED", "api"),
			]);
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
			const res = await httpClient.post<TaskApiDto>("/boardTasks", createTask);
			return toTask(res.data);
		} catch (error) {
			if (!(error instanceof AxiosError))
				return Result.Error([
					taskPersistenceErrors.dataNotFound("UNDEFINED", "api"),
				]);

			const response = error.response?.data as ProblemDetails;

			if (response.status === HttpStatusCode.BadRequest) {
				const badRequestErrors: AppError[] = [];

				if (response.errors?.title)
					badRequestErrors.push(taskValidationError.tooLongTitle("UNDEFINED"));
				if (response.errors?.priority)
					badRequestErrors.push(
						taskValidationError.invalidPriority("UNDEFINED", data.priority),
					);
				if (response.errors?.position) {
					badRequestErrors.push(
						taskValidationError.invalidPosition("UNDEFINED", data.position),
					);
				}

				if (badRequestErrors.length > 0) return Result.Error(badRequestErrors);
			}

			return Result.Error([
				taskPersistenceErrors.dataNotFound("UNDEFINED", "api"),
			]);
		}
	},

	update: async (data: TaskModel): Promise<Result<TaskModel>> => {
		try {
			const res = await httpClient.put<
				TaskApiDto,
				AxiosResponse<TaskApiDto>,
				UpdateTaskRequest
			>(`/boardTasks/${data.id}`, {
				columnId: data.columnId,
				id: data.id,
				title: data.title,
				description: data.description,
				isCompleted: data.isCompleted,
				priority: data.priority,
			});

			return toTask(res.data);
		} catch (error) {
			if (!(error instanceof AxiosError))
				return Result.Error([
					taskPersistenceErrors.dataNotFound("UNDEFINED", "api"),
				]);

			const response = error.response?.data as ProblemDetails;

			if (response.status === HttpStatusCode.NotFound)
				return Result.Error([taskPersistenceErrors.notFound(data.id)]);

			if (response.status === HttpStatusCode.BadRequest) {
				const badRequestErrors: AppError[] = [];

				if (response.errors?.title)
					badRequestErrors.push(taskValidationError.tooLongTitle("UNDEFINED"));
				if (response.errors?.priority)
					badRequestErrors.push(
						taskValidationError.invalidPriority("UNDEFINED", data.priority),
					);

				if (badRequestErrors.length > 0) return Result.Error(badRequestErrors);
			}

			return Result.Error([
				taskPersistenceErrors.dataNotFound("UNDEFINED", "api"),
			]);
		}
	},

	delete: async (data: TaskModel) => {
		try {
			const res = await httpClient.delete<string>(`/boardTasks/${data.id}`);
			return res.data ? Result.Success(res.data) : Result.Error([]);
		} catch (error) {
			if (error instanceof AxiosError) {
				const response = error.response?.data as ProblemDetails;

				if (response.status === HttpStatusCode.NotFound)
					return Result.Error([taskPersistenceErrors.notFound(data.id)]);

				if (response.status === HttpStatusCode.BadRequest)
					return Result.Error([taskValidationError.invalidId(data.id)]);
			}

			return Result.Error([
				taskPersistenceErrors.dataNotFound("UNDEFINED", "api"),
			]);
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
		} catch (error) {
			if (!(error instanceof AxiosError))
				return Result.Error([
					taskPersistenceErrors.dataNotFound("UNDEFINED", "api"),
				]);

			const response = error.response?.data as ProblemDetails;

			if (response.status === HttpStatusCode.NotFound)
				return Result.Error([taskPersistenceErrors.notFound(data.id)]);

			if (response.status === HttpStatusCode.BadRequest) {
				const badRequestErrors: AppError[] = [];

				if (response.errors?.id)
					badRequestErrors.push(taskValidationError.invalidId(data.id));
				if (response.errors?.position)
					badRequestErrors.push(
						taskValidationError.negativePosition(data.id, data.position),
					);

				if (badRequestErrors.length > 0) return Result.Error(badRequestErrors);
			}

			return Result.Error([
				taskPersistenceErrors.dataNotFound("UNDEFINED", "api"),
			]);
		}
	},
};

const toTask = (model: TaskApiDto) =>
	Task({
		columnId: model.columnId,
		id: model.id,
		title: model.title,
		description: model.description,
		isCompleted: model.isCompleted,
		position: model.position,
		priority: model.priority,
		subtaskIds: [],
	});
