import { Result } from "@/shared/domain/result";
import { reorderAndResequence } from "@/shared/domain/utils/reorder.utils";
import {
	sessionDb,
	sessionDbKeys,
} from "@/shared/infra/persistence/session-storage.db";
import z from "zod";
import {
	taskPersistenceErrors,
	taskValidationErrors,
} from "../domain/task.errors";
import { TaskModel } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";

export const sessionStorageTaskRepository: ITaskRepository = {
	findById: async (taskId: TaskModel["id"]): Promise<Result<TaskModel>> => {
		const { isSuccess, value, errors } = await loadPersistedTasks();
		if (!isSuccess) return Result.Failure(errors);

		const foundedTask = value.find((t) => t.id === taskId);
		return foundedTask
			? Result.Success(foundedTask)
			: Result.Failure([taskPersistenceErrors.notFound(taskId)]);
	},

	create: async (data: TaskModel) => {
		const { isSuccess, value, errors } = await loadPersistedTasks();
		if (!isSuccess) return Result.Failure(errors);

		sessionDb.tasks.save([...value, data]);
		return Result.Success(data);
	},

	update: async (data: TaskModel): Promise<Result<TaskModel>> => {
		const { isSuccess, value, errors } = await loadPersistedTasks();
		if (!isSuccess) return Result.Failure(errors);

		const taskFoundedIndex = value.findIndex((t) => t.id === data.id);
		if (!taskFoundedIndex)
			return Result.Failure([taskPersistenceErrors.notFound(data.id)]);

		value[taskFoundedIndex] = data;
		sessionDb.tasks.save(value);

		return Result.Success(data);
	},

	delete: async (data: TaskModel): Promise<Result<string>> => {
		const { isSuccess, value, errors } = await loadPersistedTasks();
		if (!isSuccess) return Result.Failure(errors);

		const taskToDelete = value.find((t) => t.id === data.id);
		if (!taskToDelete)
			return Result.Failure([taskPersistenceErrors.notFound(data.id)]);

		const taskUpdated = value.filter((t) => t.id !== taskToDelete.id);
		sessionDb.tasks.save(taskUpdated);

		return Result.Success("Task deleted successfully");
	},

	reorder: async (data: TaskModel): Promise<Result<TaskModel[]>> => {
		const { isSuccess, value, errors } = await loadPersistedTasks();
		if (!isSuccess) return Result.Failure(errors);

		const tasksByColumnId = value.filter((c) => c.columnId === data.columnId);
		const taskFounded = tasksByColumnId.find((t) => t.id === data.id);

		if (!taskFounded)
			return Result.Failure([taskPersistenceErrors.notFound(data.id)]);

		if (data.position > tasksByColumnId.length)
			return Result.Failure([
				taskValidationErrors.positionTooHigh(data.position, data.id),
			]);

		if (taskFounded.position === data.position)
			return Result.Success(
				tasksByColumnId.sort((a, b) => a.position - b.position),
			);

		const reorderedTasks = reorderAndResequence(tasksByColumnId, taskFounded);
		sessionDb.tasks.save(reorderedTasks);

		return Result.Success(reorderedTasks);
	},
};

const taskListSessionStorageSchema: z.ZodType<TaskModel[]> = z.array(
	z.object({
		columnId: z.string(),
		id: z.string(),
		title: z.string(),
		description: z.string(),
		isCompleted: z.boolean(),
		position: z.number().min(0),
		priority: z.enum(["low", "medium", "high"]),
		subTaskIds: z.array(z.string()),
	}),
);

const loadPersistedTasks = async (): Promise<Result<TaskModel[]>> => {
	const persistedTasks = sessionDb.tasks.get();

	if (!persistedTasks)
		return Result.Failure([
			taskPersistenceErrors.dataNotFound(
				sessionDbKeys.tasks,
				"SESSION_STORAGE",
			),
		]);

	const validation =
		await taskListSessionStorageSchema.safeParseAsync(persistedTasks);

	return validation.success
		? Result.Success(validation.data)
		: Result.Failure([
				taskPersistenceErrors.corruptedData(
					sessionDbKeys.tasks,
					"SESSION_STORAGE",
				),
			]);
};
