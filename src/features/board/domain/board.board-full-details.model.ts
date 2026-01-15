import { ColumnModel } from "@/features/column";
import { SubTaskModel } from "@/features/subTask/domain/subTask.model";
import { TaskModel } from "@/features/task";

export interface BoardFullDetailsModel {
	columns: ColumnModel[];
	tasks: TaskModel[];
	subTasks: SubTaskModel[];
}
