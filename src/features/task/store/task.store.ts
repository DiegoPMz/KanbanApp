import { ColumnStateModel } from "@/features/column";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createTask, CreateTaskDto } from "../application/task.create.use-case";
import { deleteTask, DeleteTaskDto } from "../application/task.delete.use-case";
import { reorderTask } from "../application/task.reorder.use-case";
import { updateTask, UpdateTaskDto } from "../application/task.update.use-case";
import { TaskModel } from "../domain/task.model";
import { StateTaskRepository } from "../infra/task.repository.state";

export interface TaskStateModel {
	columnId: ColumnStateModel["id"];
	id: TaskModel["id"];
	title: string;
	description: string;
	isCompleted: boolean;
	position: number;
	priority: string;
	subtaskIds: string[];
}

interface TaskState {
	tasks: TaskStateModel[];
	actions: {
		createTaskHandler: (data: CreateTaskDto) => Promise<TaskModel | null>;
		updateTaskHandler: (data: UpdateTaskDto) => Promise<TaskModel | null>;
		reorderTaskHandler: (data: TaskStateModel) => Promise<TaskModel | null>;
		deleteTaskHandler: (data: DeleteTaskDto) => Promise<TaskModel | null>;
	};
}

export const useTaskStore = create<TaskState>()(
	devtools((set) => ({
		tasks: [],
		actions: {
			createTaskHandler: async (data: CreateTaskDto) => {
				const result = await createTask(StateTaskRepository()).handle(data);
				if (!result.isSuccess) {
					return null;
				}

				set((state) => ({
					tasks: [...state.tasks, toTaskState(result.value)],
				}));
				return result.value;
			},
			updateTaskHandler: async (data: UpdateTaskDto) => {
				const result = await updateTask(StateTaskRepository()).handle(data);
				if (!result.isSuccess) {
					return null;
				}

				set((state) => ({
					tasks: state.tasks.map((t) =>
						t.id === result.value.id ? toTaskState(result.value) : t,
					),
				}));

				return result.value;
			},
			reorderTaskHandler: async (data: TaskStateModel) => {
				const result = await reorderTask(StateTaskRepository()).handle({
					id: data.id,
					position: data.position,
				});
				if (!result.isSuccess) {
					return null;
				}

				const reorderedTasks = result.value.map((c) => toTaskState(c));

				set((state) => ({
					tasks: [
						...state.tasks.filter((t) => t.columnId !== data.columnId),
						...reorderedTasks,
					],
				}));

				return result.value.find((t) => t.id === data.id) ?? null;
			},
			deleteTaskHandler: async (data: DeleteTaskDto) => {
				const result = await deleteTask(StateTaskRepository()).handle(data);
				if (!result.isSuccess) {
					return null;
				}

				set((state) => ({
					tasks: state.tasks.filter((t) => t.id !== result.value.id),
				}));

				return result.value;
			},
		},
	})),
);

const toTaskState = (model: TaskModel): TaskStateModel => ({
	columnId: model.columnId,
	id: model.id,
	title: model.title,
	description: model.description,
	isCompleted: model.isCompleted,
	position: model.position,
	priority: model.priority,
	subtaskIds: model.subtasks.map((st) => st.id),
});
