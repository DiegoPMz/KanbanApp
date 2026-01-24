import { BoardModel } from "@/features/board";
import { ColumnModel } from "@/features/column";
import { SubTaskModel } from "@/features/subTask";
import { TaskModel } from "@/features/task";
import { UserModel } from "@/features/user";
import { safeJsonParse } from "../utils/json.utils";

export const sessionDbKeys = {
	boards: "DEMO_KANBAN_BOARDS",
	columns: "DEMO_KANBAN_COLUMNS",
	tasks: "DEMO_KANBAN_TASKS",
	subtasks: "DEMO_KANBAN_SUBTASKS",
	user: "DEMO_KANBAN_USER",
};

export const sessionDb = {
	boards: {
		get: () => getItem<BoardModel[]>(sessionDbKeys.boards),
		save: (data: BoardModel[]) => setItem(sessionDbKeys.boards, data),
		clear: () => removeItem(sessionDbKeys.boards),
	},
	columns: {
		get: () => getItem<ColumnModel[]>(sessionDbKeys.columns),
		save: (data: ColumnModel[]) => setItem(sessionDbKeys.columns, data),
		clear: () => removeItem(sessionDbKeys.columns),
	},
	tasks: {
		get: () => getItem<TaskModel[]>(sessionDbKeys.tasks),
		save: (data: TaskModel[]) => setItem(sessionDbKeys.tasks, data),
		clear: () => removeItem(sessionDbKeys.tasks),
	},
	subtasks: {
		get: () => getItem<SubTaskModel[]>(sessionDbKeys.subtasks),
		save: (data: SubTaskModel[]) => setItem(sessionDbKeys.subtasks, data),
		clear: () => removeItem(sessionDbKeys.subtasks),
	},
	user: {
		get: () => getItem<UserModel>(sessionDbKeys.user),
		save: (data: UserModel) => setItem(sessionDbKeys.user, data),
		clear: () => removeItem(sessionDbKeys.user),
	},
};

function setItem<T>(key: string, data: T) {
	sessionStorage.setItem(key, JSON.stringify(data));
}
function removeItem(key: string) {
	sessionStorage.removeItem(key);
}
function getItem<T>(key: string): T | null {
	return safeJsonParse<T>(sessionStorage.getItem(key) as string);
}
