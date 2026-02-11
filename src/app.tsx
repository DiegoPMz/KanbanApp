import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { DependencyConfigurationProvider } from "./shared/infra/dependency-injection/dependency-configuration.context";
import {
	SessionTypeProvider,
	useSessionTypeLogic,
} from "./shared/infra/dependency-injection/session-type.context";

export const queryClient = new QueryClient();

export const router = createRouter({
	routeTree,
	context: {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		sessionType: undefined!,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		setBaseSessionType: undefined!,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		setDemoSessionType: undefined!,

		queryClient,
	},
	defaultPreload: "intent",
	// Since we're using React Query, we don't want loader calls to ever be stale
	// This will ensure that the loader is always called when the route is preloaded or visited
	defaultPreloadStaleTime: 0,
	scrollRestoration: true,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export const App = () => {
	const sessionLogic = useSessionTypeLogic();

	return (
		<SessionTypeProvider value={sessionLogic}>
			<DependencyConfigurationProvider>
				<QueryClientProvider client={queryClient}>
					<RouterProvider
						router={router}
						context={sessionLogic}
					/>

					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</DependencyConfigurationProvider>
		</SessionTypeProvider>
	);
};
