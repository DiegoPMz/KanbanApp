export interface ColumnModel {
	id: string;
	name: string;
	color: string;
	position: number;
	boardId: string;
	tasks: TaskModel[];
}

type ColumnInput = Omit<ColumnModel, "id"> & { id?: ColumnModel["id"] };

export const Column = (data: ColumnInput): ColumnModel => {
	return {
		id: data.id ?? crypto.randomUUID(),
		name: data.name,
		color: data.color,
		position: data.position,
		boardId: data.boardId,
		tasks: data.tasks,
	};
};

type TaskModel = { id: string };
