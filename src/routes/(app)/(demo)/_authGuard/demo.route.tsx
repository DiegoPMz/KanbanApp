import { DashboardLayout } from "@/shared/presentation/layouts/dashboard-layout";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(demo)/_authGuard/demo")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<DashboardLayout>
			<Outlet />
		</DashboardLayout>
	);
}
