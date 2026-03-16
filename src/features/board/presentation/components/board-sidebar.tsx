import { Button } from "@/shared/presentation/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/shared/presentation/components/ui/sidebar";
import { BoardModel } from "../../domain/board.model";

export const BoardSidebar = () => {
	// const { data: boardList } = useGetBoardList({ limit: 8 });

	const boardList: BoardModel[] = [];

	return (
		<Sidebar
			variant="inset"
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Projects</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{boardList.map((board) => (
								<SidebarMenuItem key={board.id}>
									<SidebarMenuButton asChild>
										<a href="#">
											{/*<div
												className="min-h-2 min-w-2 rounded-full"
												style={{ backgroundColor: board.color }}
											/>*/}
											<span>{board.name}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarSeparator className="mx-0" />
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Button variant={"outline"}>+ new board</Button>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
