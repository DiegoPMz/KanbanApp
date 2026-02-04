import { apiAuthService, loginRegister } from "@/features/auth";
import {
	apiBoardRepository,
	createBoard,
	deleteBoard,
	getBoardDetails,
	getBoardsPaginated,
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
import { apiUserRepository, getUserDetails, updateUser } from "@/features/user";
import { appDemoDependencies } from "./app-dependencies.demo";
import { AppDependencies } from "./dependency-configuration.context";

export const appBaseDependencies: AppDependencies = {
	board: {
		createBoard: createBoard(apiBoardRepository),
		updateBoard: updateBoard(apiBoardRepository),
		deleteBoard: deleteBoard(apiBoardRepository),
		getBoardDetails: getBoardDetails(apiBoardRepository),
		getBoardPaginated: getBoardsPaginated(apiBoardRepository),
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
		loginDemo: appDemoDependencies.auth.loginDemo,
		loginRegister: loginRegister(apiAuthService()),
	},
};
