import { boardRepositoryErrors } from "@/features/board";
import { reorderAndResequence } from "@/shared/lib/reorder";
import { Result } from "@/shared/lib/result";
import { parseData } from "@/shared/lib/utils";
import z from "zod";
import { Column, ColumnModel } from "../domain/column.model";
import { IColumnRepository } from "../domain/column.repository";
import {
	columnPersistenceErrors,
	columnValidationErrors,
} from "./../domain/column.errors";

const COLUMNS_STORAGE_KEY = "DEMO_KANBAN_COLUMNS";

export const sessionStorageColumnRepository: IColumnRepository = {
	findById: async (
		columnId: ColumnModel["id"],
	): Promise<Result<ColumnModel>> => {
		const currentColumns = await loadPersistedColumns();
		if (!currentColumns.isSuccess) return Result.Error(currentColumns.errors);

		const foundedColumn = currentColumns.value.find((c) => c.id === columnId);
		return !foundedColumn
			? Result.Error([columnPersistenceErrors.notFound(columnId)])
			: Result.Success(foundedColumn);
	},

	create: async (data: ColumnModel) => {
		const currentColumns = await loadPersistedColumns();
		if (!currentColumns.isSuccess) return Result.Error(currentColumns.errors);

		const entitiesToPersist = toColumnStorage([...currentColumns.value, data]);
		sessionStorage.setItem(
			COLUMNS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);

		return Result.Success(data);
	},

	update: async (data: ColumnModel) => {
		const currentColumns = await loadPersistedColumns();
		if (!currentColumns.isSuccess) return Result.Error(currentColumns.errors);

		const updatedColumns = currentColumns.value.map((c) =>
			c.id === data.id && c.boardId === data.boardId
				? { ...c, name: data.name, color: data.color }
				: c,
		);

		const entitiesToPersist = toColumnStorage(updatedColumns);
		sessionStorage.setItem(
			COLUMNS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);
		const updatedColumn = updatedColumns.find((c) => c.id === data.id);

		return !updatedColumn
			? Result.Error([columnPersistenceErrors.notFound(data.id)])
			: Result.Success(updatedColumn);
	},

	delete: async (data: ColumnModel) => {
		const currentColumns = await loadPersistedColumns();
		if (!currentColumns.isSuccess) return Result.Error(currentColumns.errors);

		if (!currentColumns.value.find((c) => c.id === data.id))
			return Result.Error([columnPersistenceErrors.notFound(data.id)]);

		const updatedColumns = currentColumns.value.filter((b) => b.id !== data.id);

		const entitiesToPersist = toColumnStorage(updatedColumns);
		sessionStorage.setItem(
			COLUMNS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);

		return Result.Success("Column deleted successfully");
	},

	reorder: async (data: ColumnModel) => {
		const currentColumns = await loadPersistedColumns();
		if (!currentColumns.isSuccess) return Result.Error(currentColumns.errors);

		const columnsByBoardId = currentColumns.value.filter(
			(c) => c.boardId === data.boardId,
		);

		const columnFounded = columnsByBoardId.find((c) => c.id === data.id);
		if (!columnFounded)
			return Result.Error([columnPersistenceErrors.notFound(data.id)]);

		if (data.position > columnsByBoardId.length)
			return Result.Error([
				columnValidationErrors.positionTooHigh(data.id, data.position),
			]);

		if (columnFounded.position === data.position)
			return Result.Success(columnsByBoardId);

		const reorderedColumns = reorderAndResequence(
			columnsByBoardId,
			columnFounded,
		);

		const entitiesToPersist = toColumnStorage(reorderedColumns);
		sessionStorage.setItem(
			COLUMNS_STORAGE_KEY,
			JSON.stringify(entitiesToPersist),
		);

		return Result.Success(reorderedColumns);
	},
};

const columnSessionStorageSchema = z.object({
	id: z.uuid(),
	name: z.string(),
	color: z.string(),
	position: z.number(),
	boardId: z.uuid(),
	taskIds: z.array(z.string()),
});

const columnListSessionStorageSchema = z.array(columnSessionStorageSchema);
type ColumnSessionStorage = z.infer<typeof columnSessionStorageSchema>;

export const loadPersistedColumns = async (): Promise<
	Result<ColumnModel[]>
> => {
	const persistedData = parseData<ColumnSessionStorage[]>(
		sessionStorage.getItem(COLUMNS_STORAGE_KEY) as string,
	);
	if (!persistedData)
		return Result.Error([
			boardRepositoryErrors.dataNotFound(COLUMNS_STORAGE_KEY, "SESSION"),
		]);

	const validation =
		await columnListSessionStorageSchema.safeParseAsync(persistedData);
	if (!validation.success)
		return Result.Error([
			boardRepositoryErrors.corruptedData(
				COLUMNS_STORAGE_KEY,
				"The column data does not match the expected format.",
			),
		]);

	const toColumns: ColumnModel[] = [];

	for (const data of validation.data) {
		const columnResult = Column({
			id: data.id,
			name: data.name,
			position: data.position,
			boardId: data.boardId,
			taskIds: data.taskIds,
		});

		if (!columnResult.isSuccess) {
			console.error(`invalid column`);
			continue;
		}

		toColumns.push(columnResult.value);
	}
	return Result.Success(toColumns);
};

const toColumnStorage = (columns: ColumnModel[]): ColumnSessionStorage[] =>
	columns.map((c: ColumnModel) => ({
		id: c.id,
		name: c.name,
		color: c.color,
		position: c.position,
		boardId: c.boardId,
		taskIds: c.taskIds,
	}));
