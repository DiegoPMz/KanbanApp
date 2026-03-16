import { Filter, Plus, Search, SlidersHorizontal, Users } from "lucide-react";
import { Button } from "../components/ui/button";

export const DashboardSubHeader = () => {
	return (
		<header className="border-border/50 bg-card/50 border-b backdrop-blur-sm">
			<div className="flex items-center justify-between px-4 py-3 lg:px-6">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2">
						<div className="from-primary to-primary/60 h-3 w-3 rounded-full bg-gradient-to-br" />
						<h1 className="text-foreground text-base font-semibold">
							Proyecto Dashboard
						</h1>
					</div>
					<span className="bg-primary/10 text-primary hidden rounded-full px-2.5 py-0.5 text-xs font-medium sm:inline-flex">
						8 tareas
					</span>
				</div>

				<div className="flex items-center gap-2">
					<div className="relative hidden md:block">
						<Search className="text-muted-foreground absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
						<input
							type="text"
							placeholder="Buscar tareas..."
							className="border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 h-8 w-48 rounded-lg border pl-9 pr-3 text-sm transition-all focus:w-64 focus:outline-none focus:ring-2"
						/>
					</div>

					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:text-foreground h-8 gap-1.5">
						<Filter className="h-3.5 w-3.5" />
						<span className="hidden sm:inline">Filtros</span>
					</Button>

					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:text-foreground h-8 gap-1.5">
						<SlidersHorizontal className="h-3.5 w-3.5" />
						<span className="hidden sm:inline">Vista</span>
					</Button>

					<div className="bg-border/50 hidden h-5 w-px lg:block" />

					<div className="hidden items-center gap-1 lg:flex">
						<div className="flex -space-x-2">
							{["A", "B", "C", "D"].map((initial, i) => (
								<div
									key={initial}
									className="border-card from-muted to-muted/50 text-muted-foreground flex h-7 w-7 items-center justify-center rounded-full border-2 bg-gradient-to-br text-xs font-medium"
									style={{ zIndex: 4 - i }}>
									{initial}
								</div>
							))}
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="text-muted-foreground h-7 w-7">
							<Users className="h-3.5 w-3.5" />
						</Button>
					</div>

					<Button
						size="sm"
						className="bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 h-8 gap-1.5 shadow-lg transition-all hover:shadow-xl">
						<Plus className="h-3.5 w-3.5" />
						<span className="hidden sm:inline">Nueva Tarea</span>
					</Button>
				</div>
			</div>
		</header>
	);
};
