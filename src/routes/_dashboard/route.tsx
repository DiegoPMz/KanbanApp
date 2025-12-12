import {
	apiUserRepository,
	getUser,
	sessionStorageUserRepository,
} from "@/features/user";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboard")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const { getUserState, setUserState } = context;

		const currentUser = getUserState();
		if (currentUser.id && currentUser.sessionType) return;

		const demoUserResult = await getUser(sessionStorageUserRepository).handle();
		if (demoUserResult.isSuccess) {
			setUserState(demoUserResult.value);
			return;
		}

		const registerUserResult = await getUser(apiUserRepository).handle();
		if (registerUserResult.isSuccess) {
			setUserState(demoUserResult.value);
			return;
		}

		throw redirect({ to: "/login" });
	},
});

function RouteComponent() {
	return <Outlet />;
}
