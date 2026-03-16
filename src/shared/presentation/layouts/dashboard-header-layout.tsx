import { USER_THEME_TYPES } from "@/features/user";
import { useGetUserDetails } from "@/features/user/presentation/hooks/get-user-details.hook";
import { Bell, Moon, Settings, Sun } from "lucide-react";
import { ApplicationLogo } from "../components/aplication-logo";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export function AvatarDropdown() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="rounded-full">
					<Avatar>
						<AvatarImage
							src="https://github.com/shadcn.png"
							alt="shadcn"
						/>
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-32">
				<DropdownMenuGroup>
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Billing</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const DashboardHeader = () => {
	const { data: userDetails } = useGetUserDetails();

	return (
		<header className="border-border bg-background sticky top-0 z-10 flex h-[var(--header-height)] w-full items-center justify-between border-b px-4 lg:px-6">
			{/*Logo details*/}
			<div className="flex items-center gap-3">
				<div className="bg-secondary flex items-center justify-center rounded-lg p-2 shadow-sm">
					<ApplicationLogo />
				</div>
				<div className="hidden sm:block">
					<h1 className="text-foreground text-sm font-semibold tracking-tight">
						Kanban
					</h1>
					<p className="text-muted-foreground text-[10px]">
						Project Management
					</p>
				</div>
			</div>

			{/*Rest of the contet*/}
			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-foreground h-8 w-8 transition-colors">
					<Bell className="h-4 w-4" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-foreground h-8 w-8 transition-colors">
					<Settings className="h-4 w-4" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="text-muted-foreground hover:text-foreground h-8 w-8 transition-colors">
					{userDetails.theme === USER_THEME_TYPES.LIGHT ? (
						<Moon className="h-4 w-4" />
					) : (
						<Sun className="h-4 w-4" />
					)}
				</Button>

				<AvatarDropdown />
			</div>
		</header>
	);
};
