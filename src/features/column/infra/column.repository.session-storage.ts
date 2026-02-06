import { Result } from "@/shared/domain/result";
import { reorderAndResequence } from "@/shared/domain/utils/reorder.utils";
import {
	sessionDb,
	sessionDbKeys,
} from "@/shared/infra/persistence/session-storage.db";
import z from "zod";
import { ColumnModel } from "../domain/column.model";
import { IColumnRepository } from "../domain/column.repository";
import {
	columnPersistenceErrors,
	columnValidationErrors,
} from "./../domain/column.errors";

export const sessionStorageColumnRepository: IColumnRepository = {
	findById: async (
		columnId: ColumnModel["id"],
	): Promise<Result<ColumnModel>> => {
		const { isSuccess, value, errors } = await loadPersistedColumns();
		if (!isSuccess) return Result.Failure(errors);

		const foundedColumn = value.find((c) => c.id === columnId);
		return !foundedColumn
			? Result.Failure([columnPersistenceErrors.notFound(columnId)])
			: Result.Success(foundedColumn);
	},

	create: async (data: ColumnModel): Promise<Result<ColumnModel>> => {
		const { isSuccess, value, errors } = await loadPersistedColumns();
		if (!isSuccess) return Result.Failure(errors);

		sessionDb.columns.save([...value, data]);
		return Result.Success(data);
	},

	update: async (data: ColumnModel): Promise<Result<ColumnModel>> => {
		const { isSuccess, value, errors } = await loadPersistedColumns();
		if (!isSuccess) return Result.Failure(errors);

		const columnIndex = value.findIndex((c) => c.id === data.id);
		if (columnIndex === -1)
			Result.Failure([columnPersistenceErrors.notFound(data.id)]);

		value[columnIndex] = data;
		sessionDb.columns.save(value);

		return Result.Success(data);
	},

	delete: async (data: ColumnModel): Promise<Result<string>> => {
		const { isSuccess, value, errors } = await loadPersistedColumns();
		if (!isSuccess) return Result.Failure(errors);

		if (!value.find((c) => c.id === data.id))
			return Result.Failure([columnPersistenceErrors.notFound(data.id)]);

		const updatedColumns = value.filter((b) => b.id !== data.id);
		sessionDb.columns.save(updatedColumns);

		return Result.Success("Column deleted successfully");
	},

	reorder: async (data: ColumnModel): Promise<Result<ColumnModel[]>> => {
		const { isSuccess, value, errors } = await loadPersistedColumns();
		if (!isSuccess) return Result.Failure(errors);

		const columnsByBoardId = value.filter((c) => c.boardId === data.boardId);
		const columnFounded = columnsByBoardId.find((c) => c.id === data.id);

		if (!columnFounded)
			return Result.Failure([columnPersistenceErrors.notFound(data.id)]);

		if (data.position > columnsByBoardId.length)
			return Result.Failure([
				columnValidationErrors.positionTooHigh(data.position, data.id),
			]);

		if (columnFounded.position === data.position)
			return Result.Success(columnsByBoardId);

		const reorderedColumns = reorderAndResequence(
			columnsByBoardId,
			columnFounded,
		);
		sessionDb.columns.save(reorderedColumns);

		return Result.Success(reorderedColumns);
	},
};

const columnListSessionStorageSchema: z.ZodType<ColumnModel[]> = z.array(
	z.object({
		id: z.uuid(),
		name: z.string(),
		color: z.string(),
		position: z.number(),
		boardId: z.uuid(),
		taskIds: z.array(z.string()),
	}),
);

const loadPersistedColumns = async (): Promise<Result<ColumnModel[]>> => {
	const persistedColumns = sessionDb.columns.get();

	if (!persistedColumns)
		return Result.Failure([
			columnPersistenceErrors.dataNotFound(
				sessionDbKeys.columns,
				"SESSION_STORAGE",
			),
		]);

	const validation =
		await columnListSessionStorageSchema.safeParseAsync(persistedColumns);

	return validation.success
		? Result.Success(validation.data)
		: Result.Failure([
				columnPersistenceErrors.corruptedData(
					sessionDbKeys.columns,
					"SESSION_STORAGE",
				),
			]);
};
