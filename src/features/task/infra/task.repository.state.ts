import { Result } from "@/shared/lib/result";
import { Task, TaskModel } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";
import { useTaskStore } from "../store/task.store";
import { apiTaskRepository } from "./task.repository.api";

export const StateTaskRepository = (
	baseTaskRepository = apiTaskRepository,
): ITaskRepository => ({
	...baseTaskRepository,
	findById: async (taskId: TaskModel["id"]): Promise<Result<TaskModel>> => {
		const columnInState = useTaskStore
			.getState()
			.tasks.find((t) => t.id === taskId);

		if (columnInState)
			return Task({
				columnId: columnInState.columnId,
				id: columnInState.id,
				title: columnInState.title,
				description: columnInState.description,
				isCompleted: columnInState.isCompleted,
				position: columnInState.position,
				priority: columnInState.priority,
				subtasks: [],
			});

		return baseTaskRepository.findById(taskId);
	},
});
