import { Result } from "@/shared/lib/result";
import { parseData } from "@/shared/lib/utils";
import z from "zod";
import { Column, ColumnModel } from "../domain/column.model";
import { IColumnRepository } from "../domain/column.repository";

const COLUMNS_STORAGE_KEY = "DEMO_KANBAN_COLUMNS";

export const sessionStorageColumnRepository: IColumnRepository = {
	findById: async (
		columnId: ColumnModel["id"],
	): Promise<Result<ColumnModel>> => {
		const currentColumns = await loadPersistedColumns();
		if (!currentColumns.isSuccess) return Result.Error([]);

		const foundedColumn = currentColumns.value.find((c) => c.id === columnId);
		return !foundedColumn ? Result.Error([]) : Result.Success(foundedColumn);
	},

	create: async (data: ColumnModel) => {
		const currentColumns = await loadPersistedColumns();
		if (!currentColumns.isSuccess) return Result.Error([]);

		const entitiesToPersist = toColumnEntities([...currentColumns.value, data]);
		sessionStorage.setItem(
			COLUMNS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);

		return Result.Success(data);
	},

	update: async (data: ColumnModel) => {
		const currentColumns = await loadPersistedColumns();
		if (!currentColumns.isSuccess) return Result.Error([]);

		const updatedColumns = currentColumns.value.map((c) =>
			c.id === data.id && c.boardId === data.boardId
				? { ...c, name: data.name, color: data.color }
				: c,
		);

		const entitiesToPersist = toColumnEntities(updatedColumns);
		sessionStorage.setItem(
			COLUMNS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);
		const updatedColumn = updatedColumns.find((c) => c.id === data.id);

		return !updatedColumn ? Result.Error([]) : Result.Success(updatedColumn);
	},

	delete: async (data: ColumnModel) => {
		const currentColumns = await loadPersistedColumns();
		if (!currentColumns.isSuccess) return Result.Error([]);

		const updatedColumns = currentColumns.value.filter((b) => b.id !== data.id);

		const entitiesToPersist = toColumnEntities(updatedColumns);
		sessionStorage.setItem(
			COLUMNS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);

		return Result.Success("Board deleted successfully");
	},

	reorder: async (data: ColumnModel) => {
		const currentColumns = await loadPersistedColumns();
		if (!currentColumns.isSuccess) return Result.Error([]);

		const columnsByBoardId = currentColumns.value.filter(
			(c) => c.boardId === data.boardId,
		);
		const columnFounded = columnsByBoardId.find((c) => c.id === data.id);
		if (!columnFounded) return Result.Error([]);

		if (data.position > columnsByBoardId.length) return Result.Error([]);

		columnsByBoardId.sort((a, b) => a.position - b.position);

		if (columnFounded.position == data.position)
			return Result.Success(columnsByBoardId);

		const reorderedColumns: ColumnModel[] = [];
		let index = 1;

		for (const c of columnsByBoardId.filter((c) => c.id !== data.id)) {
			if (index == data.position) {
				reorderedColumns.push({ ...columnFounded, position: data.position });
				index++;
			}

			reorderedColumns.push({ ...c, position: index });
			index++;
		}

		if (!reorderedColumns.some((c) => c.id === data.id)) {
			reorderedColumns.push({ ...columnFounded, position: index });
		}

		const updatedColumns = [
			...currentColumns.value.filter((c) => c.boardId !== data.boardId),
			...reorderedColumns,
		];

		const entitiesToPersist = toColumnEntities(updatedColumns);
		sessionStorage.setItem(
			COLUMNS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);

		return Result.Success(reorderedColumns);
	},
};

const columnEntitySchema = z.object({
	id: z.uuid(),
	name: z.string(),
	color: z.string(),
	position: z.number(),
	boardId: z.uuid(),
});

const columnEntityCollectionSchema = z.array(columnEntitySchema);
type ColumnEntity = z.infer<typeof columnEntitySchema>;
type ColumnEntityCollection = z.infer<typeof columnEntityCollectionSchema>;

const loadPersistedColumns = async (): Promise<Result<ColumnModel[]>> => {
	const rawData = sessionStorage.getItem(COLUMNS_STORAGE_KEY);
	if (!rawData) return Result.Error([]);

	const persistedData = parseData<ColumnEntityCollection>(rawData);
	if (!persistedData) return Result.Error([]);

	const validation =
		await columnEntityCollectionSchema.safeParseAsync(persistedData);
	if (!validation.success) return Result.Error([]);

	const toColumns: ColumnModel[] = [];

	for (const data of validation.data) {
		const columnResult = Column({
			id: data.id,
			name: data.name,
			position: data.position,
			boardId: data.boardId,
			tasks: [],
		});

		if (!columnResult.isSuccess) {
			console.error(`invalid column`);
			continue;
		}

		toColumns.push(columnResult.value);
	}
	return Result.Success(toColumns);
};

const toColumnEntities = (columns: ColumnModel[]): ColumnEntity[] =>
	columns.map((c: ColumnModel) => ({
		id: c.id,
		name: c.name,
		color: c.color,
		position: c.position,
		boardId: c.boardId,
	}));
