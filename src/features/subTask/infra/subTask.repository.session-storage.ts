import { Result } from "@/shared/domain/result";
import { safeJsonParse } from "@/shared/infra/utils/json.utils";
import z from "zod";
import { subTaskPersistenceErrors } from "../domain/subTask.errors";
import { SubTask, SubTaskModel } from "../domain/subTask.model";
import { ISubTaskRepository } from "../domain/subTask.repository";

export const SUBTASKS_STORAGE_KEY = "DEMO_KANBAN_SUBTASKS";

export const sessionStorageSubTaskRepository: ISubTaskRepository = {
	findById: async (
		columnId: SubTaskModel["id"],
	): Promise<Result<SubTaskModel>> => {
		const currentSubTasks = await loadPersistedSubTasks();
		if (!currentSubTasks.isSuccess) return Result.Error(currentSubTasks.errors);

		const foundSubTask = currentSubTasks.value.find(
			(subTask) => subTask.id === columnId,
		);
		if (!foundSubTask) {
			return Result.Error([
				subTaskPersistenceErrors.dataNotFound(columnId, "SESSION"),
			]);
		}

		return Result.Success(foundSubTask);
	},

	create: async (data: SubTaskModel): Promise<Result<SubTaskModel>> => {
		const currentSubTasks = await loadPersistedSubTasks();
		if (!currentSubTasks.isSuccess) return Result.Error(currentSubTasks.errors);

		const updatedSubTasks = [...currentSubTasks.value, data];
		sessionStorage.setItem(
			SUBTASKS_STORAGE_KEY,
			JSON.stringify(updatedSubTasks.map((s) => toSubTaskStorage(s))),
		);

		return Result.Success(data);
	},

	update: async (data: SubTaskModel): Promise<Result<SubTaskModel>> => {
		const currentSubTasks = await loadPersistedSubTasks();
		if (!currentSubTasks.isSuccess) return Result.Error(currentSubTasks.errors);

		const foundSubTask = currentSubTasks.value.find(
			(subTask) => subTask.id === data.id,
		);
		if (!foundSubTask) {
			return Result.Error([
				subTaskPersistenceErrors.dataNotFound(data.id, "SESSION"),
			]);
		}

		const updatedSubTasks = currentSubTasks.value.map((subTask) =>
			subTask.id === data.id
				? {
						...subTask,
						description: data.description,
						isCompleted: data.isCompleted,
					}
				: subTask,
		);
		sessionStorage.setItem(
			SUBTASKS_STORAGE_KEY,
			JSON.stringify(updatedSubTasks.map((s) => toSubTaskStorage(s))),
		);

		return Result.Success(data);
	},

	delete: async (data: SubTaskModel): Promise<Result<string>> => {
		const currentSubTasks = await loadPersistedSubTasks();
		if (!currentSubTasks.isSuccess) return Result.Error(currentSubTasks.errors);

		const foundSubTask = currentSubTasks.value.find(
			(subTask) => subTask.id === data.id,
		);
		if (!foundSubTask) {
			return Result.Error([
				subTaskPersistenceErrors.dataNotFound(data.id, "SESSION"),
			]);
		}
		const updatedSubTasks = currentSubTasks.value.filter(
			(subTask) => subTask.id !== data.id,
		);
		sessionStorage.setItem(
			SUBTASKS_STORAGE_KEY,
			JSON.stringify(updatedSubTasks.map((s) => toSubTaskStorage(s))),
		);

		return Result.Success("SubTask deleted successfully");
	},
};

const subTaskSessionStorageSchema = z.object({
	id: z.string(),
	taskId: z.string(),
	description: z.string().max(500),
	isCompleted: z.boolean(),
});

const subTaskListSessionStorageSchema = z.array(subTaskSessionStorageSchema);
type SubTaskSessionStorage = z.infer<typeof subTaskSessionStorageSchema>;

export const loadPersistedSubTasks = async (): Promise<
	Result<SubTaskModel[]>
> => {
	const persistedData = safeJsonParse<SubTaskSessionStorage[]>(
		sessionStorage.getItem(SUBTASKS_STORAGE_KEY) as string,
	);
	if (!persistedData)
		return Result.Error([
			subTaskPersistenceErrors.dataNotFound(SUBTASKS_STORAGE_KEY, "SESSION"),
		]);

	const validation =
		await subTaskListSessionStorageSchema.safeParseAsync(persistedData);

	if (!validation.success)
		return Result.Error([
			subTaskPersistenceErrors.corruptedData(
				SUBTASKS_STORAGE_KEY,
				"The subTask data does not match the expected format.",
			),
		]);

	const toSubTasks: SubTaskModel[] = [];

	for (const data of validation.data) {
		const subTaskResult = SubTask({
			taskId: data.taskId,
			description: data.description,
			isCompleted: data.isCompleted,
		});

		if (!subTaskResult.isSuccess) {
			console.error(`invalid subTask`);
			continue;
		}

		toSubTasks.push(subTaskResult.value);
	}

	return Result.Success(toSubTasks);
};

export const toSubTaskStorage = (model: SubTaskModel) => {
	return {
		id: model.id,
		taskId: model.taskId,
		description: model.description,
		isCompleted: model.isCompleted,
	};
};
