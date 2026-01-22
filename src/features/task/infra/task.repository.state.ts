import { Result } from "@/shared/domain/result";
import { Task, TaskModel } from "../domain/task.model";
import { ITaskRepository } from "../domain/task.repository";
import { useTaskStore } from "../store/task.store";
import { apiTaskRepository } from "./task.repository.api";

export const StateTaskRepository = (
	baseTaskRepository = apiTaskRepository,
): ITaskRepository => ({
	...baseTaskRepository,
	findById: async (taskId: TaskModel["id"]): Promise<Result<TaskModel>> => {
		const taskInState = useTaskStore
			.getState()
			.tasks.find((t) => t.id === taskId);

		if (taskInState)
			return Task({
				columnId: taskInState?.columnId,
				id: taskInState.id,
				title: taskInState.title,
				description: taskInState.description,
				isCompleted: taskInState.isCompleted,
				position: taskInState.position,
				priority: taskInState.priority,
				subtaskIds: taskInState.subtaskIds,
			});

		return baseTaskRepository.findById(taskId);
	},
});
