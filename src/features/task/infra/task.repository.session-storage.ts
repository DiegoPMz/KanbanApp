import { Result } from "@/shared/domain/result";
import { reorderAndResequence } from "@/shared/domain/utils/reorder.utils";
import { safeJsonParse } from "@/shared/infra/utils/json.utils";
import z from "zod";
import {
	taskPersistenceErrors,
	taskValidationError,
} from "../domain/task.errors";
import { Task, TaskModel } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";

export const TASKS_STORAGE_KEY = "DEMO_KANBAN_TASKS";

export const sessionStorageTaskRepository: ITaskRepository = {
	findById: async (columnId: TaskModel["id"]): Promise<Result<TaskModel>> => {
		const currentTasks = await loadPersistedTasks();
		if (!currentTasks.isSuccess) return Result.Error(currentTasks.errors);

		const foundedTask = currentTasks.value.find((t) => t.id === columnId);
		return !foundedTask ? Result.Error([]) : Result.Success(foundedTask);
	},

	create: async (data: TaskModel) => {
		const currentTasks = await loadPersistedTasks();
		if (!currentTasks.isSuccess) return Result.Error(currentTasks.errors);

		const entitiesToPersist = toTaskStorage([...currentTasks.value, data]);
		sessionStorage.setItem(
			TASKS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);

		return Result.Success(data);
	},

	update: async (data: TaskModel) => {
		const currentTasks = await loadPersistedTasks();
		if (!currentTasks.isSuccess) return Result.Error(currentTasks.errors);

		const updatedTask = currentTasks.value.find((t) => t.id === data.id);
		if (!updatedTask)
			return Result.Error([taskPersistenceErrors.notFound(data.id)]);

		const updatedTasks = currentTasks.value.map((t) =>
			t.id === data.id ? { ...data } : t,
		);

		const entitiesToPersist = toTaskStorage(updatedTasks);
		sessionStorage.setItem(
			TASKS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);

		return Result.Success(updatedTask);
	},

	delete: async (data: TaskModel) => {
		const currentTasks = await loadPersistedTasks();
		if (!currentTasks.isSuccess) return Result.Error(currentTasks.errors);

		const taskToDelete = currentTasks.value.find((t) => t.id === data.id);
		if (!taskToDelete)
			return Result.Error([taskPersistenceErrors.notFound(data.id)]);

		const updatedTasks = currentTasks.value.filter((t) => t.id !== data.id);

		const entitiesToPersist = toTaskStorage(updatedTasks);
		sessionStorage.setItem(
			TASKS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);

		return Result.Success("Task deleted successfully");
	},

	reorder: async (data: TaskModel) => {
		const currentTasks = await loadPersistedTasks();
		if (!currentTasks.isSuccess) return Result.Error(currentTasks.errors);

		const tasksByColumnId = currentTasks.value.filter(
			(c) => c.columnId === data.columnId,
		);
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
		const entitiesToPersist = toTaskStorage(reorderedTasks);
		sessionStorage.setItem(
			TASKS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);

		return Result.Success(reorderedTasks);
	},
};

const taskSessionStorageSchema = z.object({
	columnId: z.string(),
	id: z.string(),
	title: z.string(),
	description: z.string(),
	isCompleted: z.boolean(),
	position: z.number().min(0),
	priority: z.enum(["low", "medium", "high"]),
	subTaskIds: z.array(z.string()),
});

type TaskSessionStorage = z.infer<typeof taskSessionStorageSchema>;
const taskListSessionStorageSchema = z.array(taskSessionStorageSchema);

export const loadPersistedTasks = async (): Promise<Result<TaskModel[]>> => {
	const persistedData = safeJsonParse<TaskSessionStorage[]>(
		sessionStorage.getItem(TASKS_STORAGE_KEY) as string,
	);
	if (!persistedData)
		return Result.Error([
			taskPersistenceErrors.dataNotFound(TASKS_STORAGE_KEY, "SESSION"),
		]);

	const validation =
		await taskListSessionStorageSchema.safeParseAsync(persistedData);
	if (!validation.success)
		return Result.Error([
			taskPersistenceErrors.corruptedData(TASKS_STORAGE_KEY, "SESSION"),
		]);

	const toTasks: TaskModel[] = [];

	for (const data of validation.data) {
		const taskResult = Task({
			columnId: data.columnId,
			id: data.id ?? crypto.randomUUID(),
			title: data.title,
			description: data.description,
			isCompleted: data.isCompleted,
			position: data.position,
			priority: data.priority,
			subtaskIds: data.subTaskIds,
		});

		if (!taskResult.isSuccess) {
			console.error(`invalid Task`);
			continue;
		}

		toTasks.push(taskResult.value);
	}
	return Result.Success(toTasks);
};

const toTaskStorage = (columns: TaskModel[]): TaskSessionStorage[] =>
	columns.map((t: TaskModel) => ({
		columnId: t.columnId,
		id: t.id,
		title: t.title,
		description: t.description,
		isCompleted: t.isCompleted,
		position: t.position,
		priority: t.priority,
		subTaskIds: t.subtaskIds,
	}));
