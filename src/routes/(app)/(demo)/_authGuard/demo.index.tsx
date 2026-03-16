import { DashboardSubHeader } from "@/shared/presentation/layouts/dashboard-sub-header-layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(demo)/_authGuard/demo/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<DashboardSubHeader />
			<div className="flex h-full">{/*BOARDS  COLUMNS*/}</div>
		</>
	)
}
