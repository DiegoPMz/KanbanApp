import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(register)/_authGuard/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="text-red-400">
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas,
			eligendi?
		</div>
	);
}
