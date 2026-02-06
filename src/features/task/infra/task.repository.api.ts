import { ResultError, Result } from "@/shared/domain/result";
import { HttpClientErrorResponse } from "@/shared/infra/http/axios-error.interceptor";
import { httpClient } from "@/shared/infra/http/http.client";
import { AxiosResponse, HttpStatusCode } from "axios";
import {
	taskPersistenceErrors,
	taskValidationErrors,
} from "../domain/task.errors";
import { Task } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";
import { TaskModel } from "./../domain/task.model";

interface TaskApiDto {
	columnId: string;
	id: string;
	title: string;
	description: string;
	isCompleted: boolean;
	position: number;
	priority: "low" | "medium" | "high";
}

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
	findById: (taskId: TaskModel["id"]): Promise<Result<TaskModel>> =>
		httpClient
			.get<TaskApiDto>(`/boardTasks/${taskId}`)
			.then((res) => toTask(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpTaskErrorToResult(error, { id: taskId } as TaskModel),
			),

	create: (data: TaskModel): Promise<Result<TaskModel>> =>
		httpClient
			.post<TaskApiDto>("/boardTasks", {
				columnId: data.columnId,
				title: data.title,
				description: data.description,
				isCompleted: data.isCompleted,
				position: data.position,
				priority: data.priority,
			})
			.then((res) => toTask(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpTaskErrorToResult(error, data),
			),

	update: (data: TaskModel): Promise<Result<TaskModel>> =>
		httpClient
			.patch<TaskApiDto, AxiosResponse<TaskApiDto>, UpdateTaskRequest>(
				`/boardTasks/${data.id}`,
				{
					columnId: data.columnId,
					id: data.id,
					title: data.title,
					description: data.description,
					isCompleted: data.isCompleted,
					priority: data.priority,
				},
			)
			.then((res) => toTask(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpTaskErrorToResult(error, data),
			),

	delete: (data: TaskModel) =>
		httpClient
			.delete<string>(`/boardTasks/${data.id}`)
			.then((res) => Result.Success(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpTaskErrorToResult(error, data),
			),

	reorder: (data: TaskModel): Promise<Result<TaskModel[]>> =>
		httpClient
			.patch<TaskApiDto[], AxiosResponse<TaskApiDto[]>, ReorderBody>(
				`/boardTasks/reorder`,
				{
					columnId: data.columnId,
					id: data.id,
					position: data.position,
				},
			)
			.then((res) =>
				Result.Success(res.data.map((taskDto) => toTask(taskDto).value)),
			)
			.catch((error: HttpClientErrorResponse) =>
				mapHttpTaskErrorToResult(error, data),
			),
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

const mapHttpTaskErrorToResult = <R = TaskModel>(
	error: HttpClientErrorResponse,
	model: TaskModel,
): Result<R> => {
	const statusCode = error.response?.status;
	const responseData = error.response?.data;

	if (statusCode === HttpStatusCode.NotFound) {
		return Result.Failure([taskPersistenceErrors.notFound(model.id)]);
	}

	if (statusCode === HttpStatusCode.BadRequest && responseData?.errors) {
		const validationErrors: ResultError[] = [];
		const fields = responseData.errors;

		if (fields.title)
			validationErrors.push(
				taskValidationErrors.tooLongTitle(model.title.length, model.id),
			);

		if (fields.priority)
			validationErrors.push(
				taskValidationErrors.invalidPriority(model.priority, model.id),
			);

		if (fields.position)
			validationErrors.push(
				taskValidationErrors.negativePosition(model.position, model.id),
			);

		if (fields.columnId)
			validationErrors.push(
				taskValidationErrors.invalidColumnId(model.columnId, model.id),
			);

		if (fields.id)
			validationErrors.push(taskValidationErrors.invalidId(model.id));

		if (fields.isCompleted !== undefined)
			validationErrors.push(
				taskValidationErrors.invalidCompletionStatus(model.id),
			);

		if (validationErrors.length > 0) return Result.Failure(validationErrors);
	}

	return Result.Failure([
		taskPersistenceErrors.dataNotFound("/boardTasks", "api"),
	]);
};
