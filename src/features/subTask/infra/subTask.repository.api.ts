import { httpClient } from "@/shared/api/api.client";
import { ProblemDetails } from "@/shared/api/http-error.interceptor";
import { AppError, Result } from "@/shared/lib/result";
import { AxiosError, HttpStatusCode } from "axios";
import {
	subTaskPersistenceErrors,
	subTaskValidationError,
} from "../domain/subTask.errors";
import { SubTask, SubTaskModel } from "../domain/subTask.model";
import { ISubTaskRepository } from "../domain/subTask.repository";

interface SubTaskApiDto {
	id: string;
	taskId: string;
	description: string;
	isCompleted: boolean;
}

export const apiSubTaskRepository: ISubTaskRepository = {
	findById: (id: string): Promise<Result<SubTaskModel>> =>
		httpClient
			.get(`/subtasks/${id}`)
			.then((res) => toSubTask(res.data))
			.catch((error: AxiosError<ProblemDetails>) => {
				if (error.response?.data.status === HttpStatusCode.NotFound)
					return Result.Error([subTaskPersistenceErrors.notFound(id)]);

				if (error.response?.data.status === HttpStatusCode.BadRequest)
					return Result.Error([subTaskValidationError.invalidId(id)]);

				return Result.Error([
					subTaskPersistenceErrors.dataNotFound("UNDEFINED", "api"),
				]);
			}),

	create: (subTask: SubTaskModel): Promise<Result<SubTaskModel>> =>
		httpClient
			.post<SubTaskApiDto>("/subtasks", {
				taskId: subTask.taskId,
				description: subTask.description,
				isCompleted: subTask.isCompleted,
			})
			.then((res) => toSubTask(res.data))
			.catch((error: AxiosError<ProblemDetails>) => {
				if (error.response?.data.status === HttpStatusCode.BadRequest) {
					const badRequestErrors: AppError[] = [];
					if (error.response?.data.errors?.description)
						badRequestErrors.push(
							subTaskValidationError.tooLongDescription("UNDEFINED"),
						);
					if (error.response?.data.errors?.isCompleted)
						badRequestErrors.push(
							subTaskValidationError.invalidIsCompleted("UNDEFINED"),
						);
					if (error.response?.data.errors?.taskId)
						badRequestErrors.push(
							subTaskValidationError.invalidTaskId("UNDEFINED"),
						);
					if (badRequestErrors.length > 0)
						return Result.Error(badRequestErrors);
				}
				return Result.Error([
					subTaskPersistenceErrors.dataNotFound("UNDEFINED", "api"),
				]);
			}),

	update: (subTask: SubTaskModel): Promise<Result<SubTaskModel>> =>
		httpClient
			.patch<SubTaskApiDto>(`/subtasks/${subTask.id}`, {
				description: subTask.description,
				isCompleted: subTask.isCompleted,
			})
			.then((res) => toSubTask(res.data))
			.catch((error: AxiosError<ProblemDetails>) => {
				if (error.response?.data.status === HttpStatusCode.NotFound)
					return Result.Error([subTaskPersistenceErrors.notFound(subTask.id)]);
				if (error.response?.data.status === HttpStatusCode.BadRequest) {
					const badRequestErrors: AppError[] = [];
					if (error.response?.data.errors?.description)
						badRequestErrors.push(
							subTaskValidationError.tooLongDescription("UNDEFINED"),
						);
					if (error.response?.data.errors?.isCompleted)
						badRequestErrors.push(
							subTaskValidationError.invalidIsCompleted("UNDEFINED"),
						);
					if (badRequestErrors.length > 0)
						return Result.Error(badRequestErrors);
				}
				return Result.Error([
					subTaskPersistenceErrors.dataNotFound("UNDEFINED", "api"),
				]);
			}),

	delete: (subTask: SubTaskModel): Promise<Result<string>> =>
		httpClient
			.delete(`/subtasks/${subTask.id}`)
			.then(() => Result.Success("SubTask deleted successfully"))
			.catch((error: AxiosError<ProblemDetails>) => {
				if (error.response?.data.status === HttpStatusCode.NotFound)
					return Result.Error([subTaskPersistenceErrors.notFound(subTask.id)]);

				if (error.response?.data.status === HttpStatusCode.BadRequest)
					return Result.Error([subTaskValidationError.invalidId(subTask.id)]);

				return Result.Error([
					subTaskPersistenceErrors.dataNotFound("UNDEFINED", "api"),
				]);
			}),
};

export const toSubTask = (dto: SubTaskApiDto) => {
	return SubTask({
		id: dto.id,
		taskId: dto.taskId,
		description: dto.description,
		isCompleted: dto.isCompleted,
	});
};
