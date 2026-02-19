import { ColumnModel } from "@/features/column";
import { SubTaskModel } from "@/features/subTask/domain/subTask.model";
import { TaskModel } from "@/features/task";
import { BoardModel } from "./board.model";

export interface BoardFullDetailsModel {
	board: BoardModel;
	columns: ColumnModel[];
	tasks: TaskModel[];
	subTasks: SubTaskModel[];
}
