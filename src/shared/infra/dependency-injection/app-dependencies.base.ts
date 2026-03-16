import { router } from "@/app";
import {
	apiAuthService,
	loginDemo,
	loginRegister,
	sessionStorageAuthService,
} from "@/features/auth";
import {
	apiBoardRepository,
	boardList,
	createBoard,
	deleteBoard,
	getBoardDetails,
	updateBoard,
} from "@/features/board";
import {
	apiColumnRepository,
	createColumn,
	deleteColumn,
	reorderColumn,
	updateColumn,
} from "@/features/column";
import {
	apiSubTaskRepository,
	createSubTask,
	deleteSubTask,
	updateSubTask,
} from "@/features/subTask";
import {
	apiTaskRepository,
	createTask,
	deleteTask,
	reorderTask,
	updateTask,
} from "@/features/task";
import {
	apiUserRepository,
	getUserDetails,
	sessionStorageUserCreator,
	updateUser,
} from "@/features/user";
import { AppDependencies } from "./dependency-configuration.context";

export const appBaseDependencies: AppDependencies = {
	board: {
		createBoard: createBoard(apiBoardRepository),
		updateBoard: updateBoard(apiBoardRepository),
		deleteBoard: deleteBoard(apiBoardRepository),
		getBoardDetails: getBoardDetails(apiBoardRepository),
		boardList: boardList(apiBoardRepository),
	},
	user: {
		getUserDetails: getUserDetails(apiUserRepository),
		updateUser: updateUser(apiUserRepository),
	},
	column: {
		createColumn: createColumn(apiColumnRepository),
		updateColumn: updateColumn(apiColumnRepository),
		deleteColumn: deleteColumn(apiColumnRepository),
		reorderColumn: reorderColumn(apiColumnRepository),
	},
	task: {
		createTask: createTask(apiTaskRepository),
		updateTask: updateTask(apiTaskRepository),
		deleteTask: deleteTask(apiTaskRepository),
		reorderTask: reorderTask(apiTaskRepository),
	},
	subTask: {
		createSubTask: createSubTask(apiSubTaskRepository),
		updateSubTask: updateSubTask(apiSubTaskRepository),
		deleteSubTask: deleteSubTask(apiSubTaskRepository),
	},
	auth: {
		loginDemo: loginDemo(
			sessionStorageAuthService(() => router.navigate({ to: "/demo" })),
			sessionStorageUserCreator,
		),
		loginRegister: loginRegister(apiAuthService()),
	},
};
