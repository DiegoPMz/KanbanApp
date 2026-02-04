import {
	createBoard,
	deleteBoard,
	getBoardDetails,
	getBoardsPaginated,
	updateBoard,
} from "@/features/board";
import {
	createColumn,
	deleteColumn,
	reorderColumn,
	updateColumn,
} from "@/features/column";
import {
	createSubTask,
	deleteSubTask,
	updateSubTask,
} from "@/features/subTask";
import {
	createTask,
	deleteTask,
	reorderTask,
	updateTask,
} from "@/features/task";
import { getUserDetails, updateUser } from "@/features/user";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { appBaseDependencies } from "./app-dependencies.base";
import { appDemoDependencies } from "./app-dependencies.demo";
import { useSessionType } from "./session-type.context";
import { loginDemo, loginRegister } from "@/features/auth";

export interface AppDependencies {
	user: {
		getUserDetails: ReturnType<typeof getUserDetails>;
		updateUser: ReturnType<typeof updateUser>;
	};
	board: {
		createBoard: ReturnType<typeof createBoard>;
		updateBoard: ReturnType<typeof updateBoard>;
		deleteBoard: ReturnType<typeof deleteBoard>;
		getBoardDetails: ReturnType<typeof getBoardDetails>;
		getBoardPaginated: ReturnType<typeof getBoardsPaginated>;
	};
	column: {
		createColumn: ReturnType<typeof createColumn>;
		updateColumn: ReturnType<typeof updateColumn>;
		deleteColumn: ReturnType<typeof deleteColumn>;
		reorderColumn: ReturnType<typeof reorderColumn>;
	};
	task: {
		createTask: ReturnType<typeof createTask>;
		updateTask: ReturnType<typeof updateTask>;
		deleteTask: ReturnType<typeof deleteTask>;
		reorderTask: ReturnType<typeof reorderTask>;
	};
	subTask: {
		createSubTask: ReturnType<typeof createSubTask>;
		updateSubTask: ReturnType<typeof updateSubTask>;
		deleteSubTask: ReturnType<typeof deleteSubTask>;
	};
	auth: {
		loginDemo: ReturnType<typeof loginDemo>;
		loginRegister: ReturnType<typeof loginRegister>;
	};
}

interface DependencyConfigurationValue {
	appDependencies: AppDependencies;
}

const DependencyConfigurationContext =
	createContext<DependencyConfigurationValue | null>(null);

export function DependencyConfigurationProvider({
	children,
}: {
	children: ReactNode;
}) {
	const { sessionType } = useSessionType();

	const value = useMemo(
		() => ({
			appDependencies:
				sessionType === "DEMO" ? appDemoDependencies : appBaseDependencies,
		}),
		[sessionType],
	);

	return (
		<DependencyConfigurationContext.Provider value={value}>
			{children}
		</DependencyConfigurationContext.Provider>
	);
}

export function useDependencyConfig() {
	const ctx = useContext(DependencyConfigurationContext);
	if (!ctx)
		throw new Error(
			"useDependencyConfig must be used within a DependencyConfigurationProvider",
		);
	return ctx;
}
