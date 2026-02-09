import { ResultError, Result } from "@/shared/domain/result";
import { HttpClientErrorResponse } from "@/shared/infra/http/axios-error.interceptor";
import { httpClient } from "@/shared/infra/http/http.client";
import { HttpStatusCode } from "axios";
import {
	subTaskPersistenceErrors,
	subTaskValidationErrors,
} from "../domain/subTask.errors";
import { SubTask, SubTaskModel } from "../domain/subTask.model";
import { ISubTaskRepository } from "../domain/subTask.repository";
import { mapGlobalHttpError } from "@/shared/infra/http/global-error.mapper";

interface SubTaskApiDto {
	id: string;
	taskId: string;
	description: string;
	isCompleted: boolean;
}

export const apiSubTaskRepository: ISubTaskRepository = {
	findById: (subTaskId: string): Promise<Result<SubTaskModel>> =>
		httpClient
			.get(`/subtasks/${subTaskId}`)
			.then((res) => toSubTask(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpSubTaskErrorToResult(error, { id: subTaskId } as SubTaskModel),
			),

	create: (subTask: SubTaskModel): Promise<Result<SubTaskModel>> =>
		httpClient
			.post<SubTaskApiDto>("/subtasks", {
				taskId: subTask.taskId,
				description: subTask.description,
				isCompleted: subTask.isCompleted,
			})
			.then((res) => toSubTask(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpSubTaskErrorToResult(error, subTask),
			),

	update: (subTask: SubTaskModel): Promise<Result<SubTaskModel>> =>
		httpClient
			.patch<SubTaskApiDto>(`/subtasks/${subTask.id}`, {
				description: subTask.description,
				isCompleted: subTask.isCompleted,
			})
			.then((res) => toSubTask(res.data))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpSubTaskErrorToResult(error, subTask),
			),

	delete: (subTask: SubTaskModel): Promise<Result<string>> =>
		httpClient
			.delete(`/subtasks/${subTask.id}`)
			.then(() => Result.Success("SubTask deleted successfully"))
			.catch((error: HttpClientErrorResponse) =>
				mapHttpSubTaskErrorToResult(error, subTask),
			),
};

export const toSubTask = (dto: SubTaskApiDto) => {
	return SubTask({
		id: dto.id,
		taskId: dto.taskId,
		description: dto.description,
		isCompleted: dto.isCompleted,
	});
};

const mapHttpSubTaskErrorToResult = <R = SubTaskModel>(
	error: HttpClientErrorResponse,
	model: SubTaskModel,
): Result<R> => {
	const global = mapGlobalHttpError(error);
	if (global) return Result.Failure([global]);

	const statusCode = error.response?.status ?? error.status;
	const responseData = error.response?.data;

	if (statusCode === HttpStatusCode.NotFound) {
		return Result.Failure([subTaskPersistenceErrors.notFound(model.id)]);
	}

	if (statusCode === HttpStatusCode.BadRequest && responseData?.errors) {
		const validationErrors: ResultError[] = [];
		const fields = responseData.errors;

		if (fields.id)
			validationErrors.push(subTaskValidationErrors.invalidId(model.id));

		if (fields.taskId)
			validationErrors.push(
				subTaskValidationErrors.invalidTaskId(model.taskId, model.id),
			);

		if (fields.description)
			validationErrors.push(
				subTaskValidationErrors.tooLongDescription(
					model.description.length,
					model.id,
				),
			);

		if (fields.isCompleted)
			validationErrors.push(
				subTaskValidationErrors.invalidIsCompleted(model.id),
			);

		if (validationErrors.length > 0) return Result.Failure(validationErrors);
	}

	return Result.Failure([
		subTaskPersistenceErrors.dataNotFound("/subTasks", "api"),
	]);
};
