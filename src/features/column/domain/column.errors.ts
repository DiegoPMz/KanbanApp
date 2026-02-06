import { ResultError } from "@/shared/domain/result";

/**
 * Domain / Validation Errors
 * Triggered when the Column entity's business logic is violated.
 */
export const columnValidationErrors = {
	emptyName: (id?: string): ResultError => ({
		code: "Column.NameEmpty",
		message: "Column name cannot be empty.",
		type: "Validation",
		metadata: { id, field: "name", date: new Date().toISOString() },
	}),
	tooLongName: (length: number, id?: string): ResultError => ({
		code: "Column.NameTooLong",
		message: `Column name cannot exceed 100 characters. Current length: ${length}`,
		type: "Validation",
		metadata: {
			id,
			field: "name",
			maxLength: 100,
			date: new Date().toISOString(),
		},
	}),
	invalidId: (id: string): ResultError => ({
		code: "Column.IdInvalid",
		message: "Column ID must be valid.",
		type: "Validation",
		metadata: { id, date: new Date().toISOString() },
	}),
	invalidBoardId: (boardId: string, id?: string): ResultError => ({
		code: "Column.BoardIdInvalid",
		message: "Column board ID must be a valid ID.",
		type: "Validation",
		metadata: { id, boardId, date: new Date().toISOString() },
	}),
	negativePosition: (position: number, id?: string): ResultError => ({
		code: "Column.PositionNegative",
		message: "Column position cannot be negative.",
		type: "Validation",
		metadata: { id, position, date: new Date().toISOString() },
	}),
	invalidPosition: (position: number, id?: string): ResultError => ({
		code: "Column.PositionInvalid",
		message: "Column position must be a valid number.",
		type: "Validation",
		metadata: { id, position, date: new Date().toISOString() },
	}),
	positionTooHigh: (position: number, id?: string): ResultError => ({
		code: "Column.PositionTooHigh",
		message: "Column position is higher than allowed.",
		type: "Validation",
		metadata: { id, position, date: new Date().toISOString() },
	}),
	invalidTaskIds: (id?: string): ResultError => ({
		code: "Column.TaskIdsInvalid",
		message: "Column task IDs must be a valid array of strings.",
		type: "Validation",
		metadata: { id, field: "taskIds", date: new Date().toISOString() },
	}),
	invalidColor: (color: string, id?: string): ResultError => ({
		code: "Column.ColorInvalid",
		message: `The color '${color}' is not a valid hex code.`,
		type: "Validation",
		metadata: { id, color, date: new Date().toISOString() },
	}),
};

/**
 * Persistence / Repository Errors
 * Triggered when issues occur while retrieving or saving data.
 */
export const columnPersistenceErrors = {
	notFound: (id: string): ResultError => ({
		code: "Column.NotFound",
		message: "Column not found.",
		type: "Not_found",
		metadata: { id, date: new Date().toISOString() },
	}),
	dataNotFound: (key: string, persistenceType?: string): ResultError => ({
		code: "Column.DataNotPersisted",
		message: `No data found for the key: ${key}`,
		type: "Not_found",
		metadata: { persistenceType, key, date: new Date().toISOString() },
	}),
	corruptedData: (key: string, persistenceType?: string): ResultError => ({
		code: "Column.StorageCorrupted",
		message: `Data validation failed for key: ${key}`,
		type: "Internal",
		metadata: { persistenceType, key, date: new Date().toISOString() },
	}),
};
