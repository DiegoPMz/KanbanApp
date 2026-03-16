import { Button } from "@/shared/presentation/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { PropsWithChildren } from "react";
import { ColumnModel } from "../../domain/column.model";

interface KanbanColumnProps {
	column: ColumnModel;
}

export function KanbanColumn({
	column,
	children,
}: PropsWithChildren<KanbanColumnProps>) {
	return (
		<div className="flex h-full w-72 flex-shrink-0 flex-col lg:w-80">
			{/* Column Header */}
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2.5">
					<div
						className="h-2.5 w-2.5 rounded-full shadow-sm"
						style={{
							backgroundColor: column.color,
							boxShadow: `0 0 8px ${column.color}40`,
						}}
					/>
					<h3 className="text-foreground text-sm font-medium">{column.name}</h3>
					<span className="bg-muted/50 text-muted-foreground flex h-5 min-w-[20px] items-center justify-center rounded-md px-1.5 text-xs font-medium">
						{column.taskIds.length}
					</span>
				</div>
				<div className="flex items-center gap-0.5">
					<Button
						variant="ghost"
						size="icon"
						className="text-muted-foreground hover:text-foreground h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100">
						<Plus className="h-3.5 w-3.5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="text-muted-foreground hover:text-foreground h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100">
						<MoreHorizontal className="h-3.5 w-3.5" />
					</Button>
				</div>
			</div>

			{/* Column Content */}
			<div className="bg-muted/30 ring-border/30 hover:ring-border/50 group flex-1 space-y-2.5 overflow-y-auto rounded-xl p-2 ring-1 transition-colors">
				{children}

				{/* Add Task Button */}
				<Button
					variant="ghost"
					className="text-muted-foreground group-hover:border-border/50 hover:border-primary/30 hover:bg-primary/5 hover:text-primary h-9 w-full justify-start gap-2 border border-dashed border-transparent bg-transparent opacity-0 transition-all group-hover:opacity-100">
					<Plus className="h-3.5 w-3.5" />
					Agregar tarea
				</Button>
			</div>
		</div>
	);
}
