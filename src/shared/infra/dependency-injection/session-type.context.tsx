import { USER_SESSION_TYPES, UserModel } from "@/features/user";
import {
	createContext,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";

type SessionType = UserModel["sessionType"];

export interface SessionTypeValue {
	sessionType: SessionType;
	setDemoSessionType: () => void;
	setBaseSessionType: () => void;
}

export function useSessionTypeLogic() {
	const [sessionType, setSessionType] = useState<SessionType>(
		USER_SESSION_TYPES.BASE,
	);

	const setDemoSessionType = () => setSessionType(USER_SESSION_TYPES.DEMO);
	const setBaseSessionType = () => setSessionType(USER_SESSION_TYPES.BASE);

	return useMemo(
		() => ({ sessionType, setDemoSessionType, setBaseSessionType }),
		[sessionType],
	);
}

const SessionTypeContext = createContext<SessionTypeValue | null>(null);

export function SessionTypeProvider({
	children,
	value,
}: {
	children: ReactNode;
	value: SessionTypeValue;
}) {
	return (
		<SessionTypeContext.Provider value={value}>
			{children}
		</SessionTypeContext.Provider>
	);
}

export function useSessionType() {
	const ctx = useContext(SessionTypeContext);
	if (!ctx)
		throw new Error("useSessionType must be used within a SessionTypeProvider");
	return ctx;
}
