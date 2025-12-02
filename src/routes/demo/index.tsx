import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div className="bg-cyan-300 p-4 text-white">Hello "/trial/"!</div>;
}
