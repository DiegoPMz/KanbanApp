import { SessionTypeValue } from "@/shared/infra/dependency-injection/session-type.context";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export interface RouterContext {
	sessionType: SessionTypeValue["sessionType"];
	setBaseSessionType: SessionTypeValue["setBaseSessionType"];
	setDemoSessionType: SessionTypeValue["setDemoSessionType"];

	queryClient: QueryClient;
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
