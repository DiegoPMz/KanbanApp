import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { useUserStore } from "./features/user/store/user.store";
import { routeTree } from "./routeTree.gen";
import "./shared/styles/global.css";

const router = createRouter({
	routeTree,
	context: {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		getUserState: undefined!,
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		setUserState: undefined!,
	},
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function Main() {
	const getUserState = useUserStore((state) => state.getUserState);
	const setUserState = useUserStore((state) => state.setUserState);

	return (
		<RouterProvider
			router={router}
			context={{ getUserState, setUserState }}
		/>
	);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Main />
	</React.StrictMode>,
);
