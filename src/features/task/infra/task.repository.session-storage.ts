import { Result } from "@/shared/lib/result";
import { parseData } from "@/shared/lib/utils";
import z from "zod";
import { Task, TaskModel } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";

const TASKS_STORAGE_KEY = "DEMO_KANBAN_TASKS";

export const sessionStorageTaskRepository: ITaskRepository = {
	findById: async (columnId: TaskModel["id"]): Promise<Result<TaskModel>> => {
		const currentTasks = await loadPersistedTasks();
		if (!currentTasks.isSuccess) return Result.Error([]);

		const foundedTask = currentTasks.value.find((t) => t.id === columnId);
		return !foundedTask ? Result.Error([]) : Result.Success(foundedTask);
	},

	// ❌
	create: async (data: TaskModel) => {
		const currentTasks = await loadPersistedTasks();
		if (!currentTasks.isSuccess) return Result.Error([]);

		const entitiesToPersist = toTaskEntities([...currentTasks.value, data]);
		sessionStorage.setItem(
			TASKS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);

		return Result.Success(data);
	},

	update: async (data: TaskModel) => {
		const currentTasks = await loadPersistedTasks();
		if (!currentTasks.isSuccess) return Result.Error([]);

		const updatedTasks = currentTasks.value.map((t) =>
			t.id === data.id ? { ...data } : t,
		);

		const entitiesToPersist = toTaskEntities(updatedTasks);
		sessionStorage.setItem(
			TASKS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);
		const updatedTask = updatedTasks.find((t) => t.id === data.id);

		return !updatedTask ? Result.Error([]) : Result.Success(updatedTask);
	},

	delete: async (data: TaskModel) => {
		const currentTasks = await loadPersistedTasks();
		if (!currentTasks.isSuccess) return Result.Error([]);

		const updatedTasks = currentTasks.value.filter((t) => t.id !== data.id);

		const entitiesToPersist = toTaskEntities(updatedTasks);
		sessionStorage.setItem(
			TASKS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);

		return Result.Success("Task deleted successfully");
	},

	reorder: async (data: TaskModel) => {
		const currentTasks = await loadPersistedTasks();
		if (!currentTasks.isSuccess) return Result.Error([]);

		const tasksByColumnId = currentTasks.value.filter(
			(c) => c.columnId === data.columnId,
		);
		const taskFounded = tasksByColumnId.find((t) => t.id === data.id);
		if (!taskFounded) return Result.Error([]);

		if (data.position > tasksByColumnId.length) return Result.Error([]);

		tasksByColumnId.sort((a, b) => a.position - b.position);

		if (taskFounded.position == data.position)
			return Result.Success(tasksByColumnId);

		const reorderedTasks: TaskModel[] = [];
		let index = 1;

		for (const task of tasksByColumnId.filter((t) => t.id !== data.id)) {
			if (index == data.position) {
				reorderedTasks.push({ ...taskFounded, position: data.position });
				index++;
			}

			reorderedTasks.push({ ...task, position: index });
			index++;
		}

		if (!reorderedTasks.some((t) => t.id === data.id)) {
			reorderedTasks.push({ ...taskFounded, position: index });
		}

		const updatedTasks = [
			...currentTasks.value.filter((t) => t.columnId !== data.columnId),
			...reorderedTasks,
		];

		const entitiesToPersist = toTaskEntities(updatedTasks);
		sessionStorage.setItem(
			TASKS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);

		return Result.Success(reorderedTasks);
	},
};

const taskEntitySchema = z.object({
	columnId: z.string(),
	id: z.string(),
	title: z.string(),
	description: z.string(),
	isCompleted: z.boolean(),
	position: z.number().min(0),
	priority: z.string(),
});

const taskEntityCollectionSchema = z.array(taskEntitySchema);
type TaskEntity = z.infer<typeof taskEntitySchema>;

const loadPersistedTasks = async (): Promise<Result<TaskModel[]>> => {
	const rawData = sessionStorage.getItem(TASKS_STORAGE_KEY);
	if (!rawData) return Result.Error([]);

	const persistedData = parseData<TaskEntity[]>(rawData);
	if (!persistedData) return Result.Error([]);

	const validation =
		await taskEntityCollectionSchema.safeParseAsync(persistedData);
	if (!validation.success) return Result.Error([]);

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
			subtasks: [],
		});

		if (!taskResult.isSuccess) {
			console.error(`invalid Task`);
			continue;
		}

		toTasks.push(taskResult.value);
	}
	return Result.Success(toTasks);
};

const toTaskEntities = (columns: TaskModel[]): TaskEntity[] =>
	columns.map((c: TaskModel) => ({
		columnId: c.columnId,
		id: c.id,
		title: c.title,
		description: c.description,
		isCompleted: c.isCompleted,
		position: c.position,
		priority: c.priority,
	}));
