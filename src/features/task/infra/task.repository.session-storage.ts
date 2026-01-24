import { Result } from "@/shared/domain/result";
import { reorderAndResequence } from "@/shared/domain/utils/reorder.utils";
import {
	sessionDb,
	sessionDbKeys,
} from "@/shared/infra/persistence/session-storage.db";
import z from "zod";
import {
	taskPersistenceErrors,
	taskValidationError,
} from "../domain/task.errors";
import { TaskModel } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";

export const TASKS_STORAGE_KEY = "DEMO_KANBAN_TASKS";

export const sessionStorageTaskRepository: ITaskRepository = {
	findById: async (taskId: TaskModel["id"]): Promise<Result<TaskModel>> => {
		const { isSuccess, value, errors } = await loadPersistedTasks();
		if (!isSuccess) return Result.Error(errors);

		const foundedTask = value.find((t) => t.id === taskId);
		return foundedTask
			? Result.Success(foundedTask)
			: Result.Error([taskPersistenceErrors.notFound(taskId)]);
	},

	create: async (data: TaskModel) => {
		const { isSuccess, value, errors } = await loadPersistedTasks();
		if (!isSuccess) return Result.Error(errors);

		sessionDb.tasks.save([...value, data]);
		return Result.Success(data);
	},

	update: async (data: TaskModel): Promise<Result<TaskModel>> => {
		const { isSuccess, value, errors } = await loadPersistedTasks();
		if (!isSuccess) return Result.Error(errors);

		const taskFoundedIndex = value.findIndex((t) => t.id === data.id);
		if (!taskFoundedIndex)
			return Result.Error([taskPersistenceErrors.notFound(data.id)]);

		value[taskFoundedIndex] = data;
		sessionDb.tasks.save(value);

		return Result.Success(data);
	},

	delete: async (data: TaskModel): Promise<Result<string>> => {
		const { isSuccess, value, errors } = await loadPersistedTasks();
		if (!isSuccess) return Result.Error(errors);

		const taskToDelete = value.find((t) => t.id === data.id);
		if (!taskToDelete)
			return Result.Error([taskPersistenceErrors.notFound(data.id)]);

		const taskUpdated = value.filter((t) => t.id !== taskToDelete.id);
		sessionDb.tasks.save(taskUpdated);

		return Result.Success("Task deleted successfully");
	},

	reorder: async (data: TaskModel): Promise<Result<TaskModel[]>> => {
		const { isSuccess, value, errors } = await loadPersistedTasks();
		if (!isSuccess) return Result.Error(errors);

		const tasksByColumnId = value.filter((c) => c.columnId === data.columnId);
		const taskFounded = tasksByColumnId.find((t) => t.id === data.id);

		if (!taskFounded)
			return Result.Error([taskPersistenceErrors.notFound(data.id)]);

		if (data.position > tasksByColumnId.length)
			return Result.Error([
				taskValidationError.positionTooHigh(data.id, data.position),
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
		subtaskIds: z.array(z.string()),
	}),
);

const loadPersistedTasks = async (): Promise<Result<TaskModel[]>> => {
	const persistedTasks = sessionDb.tasks.get();

	if (!persistedTasks)
		return Result.Error([
			taskPersistenceErrors.dataNotFound(sessionDbKeys.tasks, "SESSION"),
		]);

	const validation =
		await taskListSessionStorageSchema.safeParseAsync(persistedTasks);

	return validation.success
		? Result.Success(validation.data)
		: Result.Error([
				taskPersistenceErrors.corruptedData(sessionDbKeys.tasks, "SESSION"),
			]);
};
