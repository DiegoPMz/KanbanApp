import { DashboardLayout } from "@/shared/layouts/DashboardLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/(app)/")({
	component: HomePageComponent,
});

function HomePageComponent() {
	return (
		<>
			<DashboardLayout />
		</>
	);
}
