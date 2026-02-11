import { LoginCard } from "@/features/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="bg-background dark grid h-[100dvh] w-full place-items-center">
			<LoginCard />
		</div>
	);
}
