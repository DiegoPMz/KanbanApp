import { Result } from "@/shared/domain/result";
import {
	sessionDb,
	sessionDbKeys,
} from "@/shared/infra/persistence/session-storage.db";
import z from "zod";
import { SubTaskModel } from "../domain/subTask.model";
import { ISubTaskRepository } from "../domain/subTask.repository";
import { subTaskPersistenceErrors } from "./../domain/subTask.errors";

export const sessionStorageSubTaskRepository: ISubTaskRepository = {
	findById: async (
		subTaskId: SubTaskModel["id"],
	): Promise<Result<SubTaskModel>> => {
		const { isSuccess, value, errors } = await loadPersistedSubTasks();
		if (!isSuccess) return Result.Failure(errors);

		const subTaskFounded = value.find((subTask) => subTask.id === subTaskId);
		return subTaskFounded
			? Result.Success(subTaskFounded)
			: Result.Failure([subTaskPersistenceErrors.notFound(subTaskId)]);
	},

	create: async (data: SubTaskModel): Promise<Result<SubTaskModel>> => {
		const { isSuccess, value, errors } = await loadPersistedSubTasks();
		if (!isSuccess) return Result.Failure(errors);

		sessionDb.subtasks.save([...value, data]);
		return Result.Success(data);
	},

	update: async (data: SubTaskModel): Promise<Result<SubTaskModel>> => {
		const { isSuccess, value, errors } = await loadPersistedSubTasks();
		if (!isSuccess) return Result.Failure(errors);

		const subTaskFoundedId = value.findIndex(
			(subTask) => subTask.id === data.id,
		);
		if (subTaskFoundedId === -1) {
			return Result.Failure([subTaskPersistenceErrors.notFound(data.id)]);
		}

		value[subTaskFoundedId] = data;
		sessionDb.subtasks.save(value);

		return Result.Success(data);
	},

	delete: async (data: SubTaskModel): Promise<Result<string>> => {
		const { isSuccess, value, errors } = await loadPersistedSubTasks();
		if (!isSuccess) return Result.Failure(errors);

		const subTaskFounded = value.find((subTask) => subTask.id === data.id);
		if (!subTaskFounded) {
			return Result.Failure([subTaskPersistenceErrors.notFound(data.id)]);
		}
		const subTasksUpdated = value.filter((subTask) => subTask.id !== data.id);
		sessionDb.subtasks.save(subTasksUpdated);

		return Result.Success("SubTask deleted successfully");
	},
};

const subTaskListSessionStorageSchema: z.ZodType<SubTaskModel[]> = z.array(
	z.object({
		id: z.string(),
		taskId: z.string(),
		description: z.string().max(500),
		isCompleted: z.boolean(),
	}),
);

const loadPersistedSubTasks = async (): Promise<Result<SubTaskModel[]>> => {
	const persistedSubTasks = sessionDb.subtasks.get();

	if (!persistedSubTasks)
		return Result.Failure([
			subTaskPersistenceErrors.dataNotFound(
				sessionDbKeys.subtasks,
				"SESSION_STORAGE",
			),
		]);

	const validation =
		await subTaskListSessionStorageSchema.safeParseAsync(persistedSubTasks);

	return validation.success
		? Result.Success(validation.data)
		: Result.Failure([
				subTaskPersistenceErrors.corruptedData(
					sessionDbKeys.subtasks,
					"SESSION_STORAGE",
				),
			]);
};
