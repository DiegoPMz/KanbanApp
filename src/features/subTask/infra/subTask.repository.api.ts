import { httpClient } from "@/shared/api/api.client";
import { HttpClientErrorResponse } from "@/shared/api/http-error.interceptor";
import { AppError, Result } from "@/shared/lib/result";
import { HttpStatusCode } from "axios";
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
			.catch((error: HttpClientErrorResponse) =>
				mapHttpSubTaskErrorToResult(error, { id } as SubTaskModel),
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
	const statusCode = error.response?.status;
	const responseData = error.response?.data;

	if (statusCode === HttpStatusCode.NotFound) {
		return Result.Error([subTaskPersistenceErrors.notFound(model.id)]);
	}

	if (statusCode === HttpStatusCode.BadRequest && responseData?.errors) {
		const validationErrors: AppError[] = [];
		const fields = responseData.errors;

		if (fields.id)
			validationErrors.push(subTaskValidationError.invalidId(model.id));

		if (fields.taskId)
			validationErrors.push(subTaskValidationError.invalidTaskId(model.id));

		if (fields.description)
			validationErrors.push(
				subTaskValidationError.tooLongDescription(model.id),
			);

		if (fields.isCompleted)
			validationErrors.push(
				subTaskValidationError.invalidIsCompleted(model.id),
			);

		if (validationErrors.length > 0) return Result.Error(validationErrors);
	}

	return Result.Error([
		subTaskPersistenceErrors.dataNotFound("UNDEFINED", "api"),
	]);
};
