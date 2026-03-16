import { KanbanCard } from "@/features/task";
import { Button } from "@/shared/presentation/components/ui/button";
import { Plus } from "lucide-react";
import { ColumnModel } from "../../domain/column.model";
import { KanbanColumn } from "./kanban-column";

interface KanbanGridProps {
	columns: ColumnModel[];
	onDragEnd: () => void;
}

export const KanbanGrid = ({ columns }: KanbanGridProps) => {
	return (
		<div className="flex h-full gap-4 overflow-x-auto p-4 lg:p-6">
			{columns.map((c) => (
				<KanbanColumn
					key={c.id}
					column={c}>
					{c.taskIds.map((taskId) => (
						<KanbanCard
							key={taskId}
							task={
								taskId as typeof task & {
									priority: "low" | "medium" | "high";
								}
							}
						/>
					))}
				</KanbanColumn>
			))}

			{/* Add Column */}
			<div className="flex h-fit w-72 flex-shrink-0">
				<Button
					variant="ghost"
					className="border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary h-10 w-full justify-start gap-2 border border-dashed bg-transparent transition-all">
					<Plus className="h-4 w-4" />
					Agregar Columna
				</Button>
			</div>
		</div>
	);
};
