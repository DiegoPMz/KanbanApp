import { useUserStore } from "@/features/user/store/user.store";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export interface RouterContext {
	getUserState: ReturnType<typeof useUserStore.getInitialState>["getUserState"];
	setUserState: ReturnType<typeof useUserStore.getInitialState>["setUserState"];
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootLayout,
});

function RootLayout() {
	return (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	);
}
