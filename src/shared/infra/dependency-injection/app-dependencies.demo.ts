import { router } from "@/app";
import {
	apiAuthService,
	loginDemo,
	loginRegister,
	sessionStorageAuthService,
} from "@/features/auth";
import {
	boardList,
	createBoard,
	deleteBoard,
	getBoardDetails,
	sessionStorageBoardRepository,
	updateBoard,
} from "@/features/board";
import {
	createColumn,
	deleteColumn,
	reorderColumn,
	sessionStorageColumnRepository,
	updateColumn,
} from "@/features/column";
import {
	createSubTask,
	deleteSubTask,
	sessionStorageSubTaskRepository,
	updateSubTask,
} from "@/features/subTask";
import {
	createTask,
	deleteTask,
	reorderTask,
	sessionStorageTaskRepository,
	updateTask,
} from "@/features/task";
import {
	getUserDetails,
	sessionStorageUserCreator,
	sessionStorageUserRepository,
	updateUser,
} from "@/features/user";
import { AppDependencies } from "./dependency-configuration.context";

export const appDemoDependencies: AppDependencies = {
	board: {
		createBoard: createBoard(sessionStorageBoardRepository),
		updateBoard: updateBoard(sessionStorageBoardRepository),
		deleteBoard: deleteBoard(sessionStorageBoardRepository),
		getBoardDetails: getBoardDetails(sessionStorageBoardRepository),
		boardList: boardList(sessionStorageBoardRepository),
	},
	user: {
		getUserDetails: getUserDetails(sessionStorageUserRepository),
		updateUser: updateUser(sessionStorageUserRepository),
	},
	column: {
		createColumn: createColumn(sessionStorageColumnRepository),
		updateColumn: updateColumn(sessionStorageColumnRepository),
		deleteColumn: deleteColumn(sessionStorageColumnRepository),
		reorderColumn: reorderColumn(sessionStorageColumnRepository),
	},
	task: {
		createTask: createTask(sessionStorageTaskRepository),
		updateTask: updateTask(sessionStorageTaskRepository),
		deleteTask: deleteTask(sessionStorageTaskRepository),
		reorderTask: reorderTask(sessionStorageTaskRepository),
	},
	subTask: {
		createSubTask: createSubTask(sessionStorageSubTaskRepository),
		updateSubTask: updateSubTask(sessionStorageSubTaskRepository),
		deleteSubTask: deleteSubTask(sessionStorageSubTaskRepository),
	},
	auth: {
		loginDemo: loginDemo(
			sessionStorageAuthService(() => router.navigate({ to: "/demo" })),
			sessionStorageUserCreator,
		),
		loginRegister: loginRegister(apiAuthService()),
	},
};
