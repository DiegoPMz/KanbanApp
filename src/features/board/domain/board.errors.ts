import { ResultError } from "@/shared/domain/result";

/**
 * Domain / Validation Errors
 * Triggered when the Board entity's business logic is violated.
 */
export const boardValidationErrors = {
	emptyName: (id?: string): ResultError => ({
		code: "Board.NameEmpty",
		message: "Board name cannot be empty.",
		type: "Validation",
		metadata: { id, field: "name", date: new Date().toISOString() },
	}),
	tooLongName: (length: number, id?: string): ResultError => ({
		code: "Board.NameTooLong",
		message: `Board name cannot exceed 100 characters. Current length: ${length}`,
		type: "Validation",
		metadata: {
			id,
			field: "name",
			maxLength: 100,
			date: new Date().toISOString(),
		},
	}),
	invalidId: (id: string): ResultError => ({
		code: "Board.IdInvalid",
		message: "Board ID must be a valid UUID.",
		type: "Validation",
		metadata: { id, date: new Date().toISOString() },
	}),
	invalidColumnIds: (id?: string): ResultError => ({
		code: "Board.ColumnIdsInvalid",
		message: "Board column IDs must be an array of strings.",
		type: "Validation",
		metadata: { id, field: "columns", date: new Date().toISOString() },
	}),
};

/**
 * Persistence / Repository Errors
 * Triggered when issues occur while retrieving or saving data.
 */
export const boardRepositoryErrors = {
	notFound: (id: string): ResultError => ({
		code: "Board.NotFound",
		message: `Board with ID ${id} not found.`,
		type: "Not_found",
		metadata: { boardId: id, date: new Date().toISOString() },
	}),
	dataNotFound: (key: string, persistenceType?: string): ResultError => ({
		code: "Board.DataNotPersisted",
		message: `No data found for the key: ${key}`,
		type: "Not_found",
		metadata: { persistenceType, key, date: new Date().toISOString() },
	}),
	corruptedData: (key: string, persistenceType?: string): ResultError => ({
		code: "Board.StorageCorrupted",
		message: `Data validation failed for the key: ${key}.`,
		type: "Internal",
		metadata: { persistenceType, key, date: new Date().toISOString() },
	}),
};
