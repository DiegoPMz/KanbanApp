import { LoginCard } from "@/features/auth";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login/")({
	component: LoginPage,
});

function LoginPage() {
	return (
		<div className="dark grid h-[100dvh] w-full place-items-center bg-background">
			<LoginCard />
		</div>
	);
}
