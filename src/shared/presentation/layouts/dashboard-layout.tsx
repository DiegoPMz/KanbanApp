import { BoardSidebar } from "@/features/board/presentation/components/board-sidebar";
import { PropsWithChildren, Suspense } from "react";
import {
	SidebarInset,
	SidebarMenuSkeleton,
	SidebarProvider,
} from "../components/ui/sidebar";
import { DashboardHeader } from "./dashboard-header-layout";

export const DashboardLayout = ({ children }: PropsWithChildren) => {
	return (
		<SidebarProvider className="flex flex-col">
			<DashboardHeader />
			<div className="flex flex-1">
				{/* It's gonna be removed later */}
				<Suspense fallback={<SidebarMenuSkeleton />}>
					<BoardSidebar />
				</Suspense>

				<SidebarInset className="overflow-x-hidden">
					<div className="flex flex-1 flex-col gap-4 p-4">
						{/*BASE CONTENT*/}

						{children}
					</div>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
};
