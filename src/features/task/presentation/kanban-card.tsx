import { Button } from "@/shared/presentation/components/ui/button";
import { cn } from "@/shared/presentation/lib/utils";
import {
	CheckCircle2,
	Circle,
	MessageSquare,
	MoreHorizontal,
	Paperclip,
} from "lucide-react";

interface Subtask {
	id: string;
	title: string;
	completed: boolean;
}

interface Task {
	id: string;
	title: string;
	description?: string;
	priority: "low" | "medium" | "high";
	subtasks?: Subtask[];
	assignee?: string;
}

interface KanbanCardProps {
	task: Task;
}

const priorityConfig = {
	low: {
		bg: "bg-emerald-500/10",
		text: "text-emerald-600 dark:text-emerald-400",
		dot: "bg-emerald-500",
		label: "Low",
	},
	medium: {
		bg: "bg-amber-500/10",
		text: "text-amber-600 dark:text-amber-400",
		dot: "bg-amber-500",
		label: "Medium",
	},
	high: {
		bg: "bg-rose-500/10",
		text: "text-rose-600 dark:text-rose-400",
		dot: "bg-rose-500",
		label: "High",
	},
};

export const KanbanCard = ({ task }: KanbanCardProps) => {
	const completedSubtasks =
		task.subtasks?.filter((s) => s.completed).length || 0;
	const totalSubtasks = task.subtasks?.length || 0;
	const progress =
		totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
	const priority = priorityConfig[task.priority];

	return (
		<div className="border-border/50 bg-card hover:border-primary/30 hover:shadow-primary/5 group cursor-pointer rounded-xl border p-3.5 shadow-sm transition-all duration-200 hover:shadow-md">
			{/* Card Header */}
			<div className="mb-2 flex items-start justify-between gap-2">
				<h4 className="text-card-foreground text-sm font-medium leading-snug">
					{task.title}
				</h4>
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
					<MoreHorizontal className="h-3.5 w-3.5" />
				</Button>
			</div>

			{task.description && (
				<p className="text-muted-foreground mb-3 line-clamp-2 text-xs leading-relaxed">
					{task.description}
				</p>
			)}

			{task.subtasks && task.subtasks.length > 0 && (
				<div className="mb-3">
					<div className="mb-2 flex items-center justify-between">
						<span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
							Subtareas
						</span>
						<span className="text-muted-foreground text-[10px] font-medium">
							{completedSubtasks}/{totalSubtasks}
						</span>
					</div>

					{/* Progress Bar */}
					<div className="bg-muted/50 mb-2.5 h-1 w-full overflow-hidden rounded-full">
						<div
							className="from-primary to-primary/80 h-full rounded-full bg-gradient-to-r transition-all duration-500"
							style={{ width: `${progress}%` }}
						/>
					</div>

					<div className="space-y-1">
						{task.subtasks.slice(0, 2).map((subtask) => (
							<div
								key={subtask.id}
								className="flex items-center gap-2 text-xs">
								{subtask.completed ? (
									<CheckCircle2 className="text-primary h-3.5 w-3.5 flex-shrink-0" />
								) : (
									<Circle className="text-muted-foreground/50 h-3.5 w-3.5 flex-shrink-0" />
								)}
								<span
									className={cn(
										"truncate",
										subtask.completed
											? "text-muted-foreground line-through"
											: "text-card-foreground",
									)}>
									{subtask.title}
								</span>
							</div>
						))}
						{task.subtasks.length > 2 && (
							<span className="text-muted-foreground text-[10px]">
								+{task.subtasks.length - 2} mas
							</span>
						)}
					</div>
				</div>
			)}

			{/* Footer */}
			<div className="border-border/30 flex items-center justify-between border-t pt-2">
				<div className="flex items-center gap-1.5">
					<span
						className={cn(
							"inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium",
							priority.bg,
							priority.text,
						)}>
						<span className={cn("h-1.5 w-1.5 rounded-full", priority.dot)} />
						{priority.label}
					</span>
				</div>

				<div className="flex items-center gap-2">
					<div className="text-muted-foreground flex items-center gap-3">
						<button className="hover:text-foreground flex items-center gap-1 text-[10px] transition-colors">
							<MessageSquare className="h-3 w-3" />
							<span>2</span>
						</button>
						<button className="hover:text-foreground flex items-center gap-1 text-[10px] transition-colors">
							<Paperclip className="h-3 w-3" />
							<span>1</span>
						</button>
					</div>

					{task.assignee && (
						<div className="from-primary/20 to-primary/10 text-primary ring-primary/20 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-medium ring-1">
							{task.assignee}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
