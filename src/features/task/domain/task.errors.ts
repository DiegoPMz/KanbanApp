import { ResultError } from "@/shared/domain/result";

/**
 * Domain / Validation Errors
 * Triggered when the Task entity's business logic is violated.
 */
export const taskValidationErrors = {
	emptyTitle: (id?: string): ResultError => ({
		code: "Task.TitleEmpty",
		message: "Task title cannot be empty.",
		type: "Validation",
		metadata: {
			id,
			field: "title",
			date: new Date().toISOString(),
		},
	}),
	tooLongTitle: (length: number, id?: string): ResultError => ({
		code: "Task.TitleTooLong",
		message: `Task title cannot exceed 200 characters. Current length: ${length}`,
		type: "Validation",
		metadata: {
			id,
			field: "title",
			maxLength: 200,
			date: new Date().toISOString(),
		},
	}),
	invalidPriority: (priority: string, id?: string): ResultError => ({
		code: "Task.PriorityInvalid",
		message: "Task priority must be one of: low, medium, high.",
		type: "Validation",
		metadata: { id, priority, date: new Date().toISOString() },
	}),
	negativePosition: (position: number, id?: string): ResultError => ({
		code: "Task.PositionNegative",
		message: "Task position cannot be negative.",
		type: "Validation",
		metadata: { id, position, date: new Date().toISOString() },
	}),
	invalidPosition: (position: number, id?: string): ResultError => ({
		code: "Task.PositionInvalid",
		message: "Task position must be a valid number.",
		type: "Validation",
		metadata: { id, position, date: new Date().toISOString() },
	}),
	positionTooHigh: (position: number, id?: string): ResultError => ({
		code: "Task.PositionTooHigh",
		message: "Task position is higher than allowed.",
		type: "Validation",
		metadata: { id, position, date: new Date().toISOString() },
	}),
	invalidId: (id: string): ResultError => ({
		code: "Task.IdInvalid",
		message: "Task ID must be valid.",
		type: "Validation",
		metadata: { id, date: new Date().toISOString() },
	}),
	invalidColumnId: (columnId: string, id?: string): ResultError => ({
		code: "Task.ColumnIdInvalid",
		message: "Task Column ID must be valid.",
		type: "Validation",
		metadata: { id, columnId, date: new Date().toISOString() },
	}),
	invalidSubtaskIds: (id?: string): ResultError => ({
		code: "Task.SubtaskIdsInvalid",
		message: "Task subtask IDs must be a valid array of strings.",
		type: "Validation",
		metadata: {
			id,
			field: "subtaskIds",
			date: new Date().toISOString(),
		},
	}),
	invalidCompletionStatus: (id?: string): ResultError => ({
		code: "Task.CompletionStatusInvalid",
		message: "Task completion status must be a boolean.",
		type: "Validation",
		metadata: {
			...(id && { id }),
			field: "isCompleted",
			date: new Date().toISOString(),
		},
	}),
};

/**
 * Persistence / Repository Errors
 * Triggered when issues occur while retrieving or saving data.
 */
export const taskPersistenceErrors = {
	notFound: (id: string): ResultError => ({
		code: "Task.NotFound",
		message: `Task not found with the id: ${id}`,
		type: "Not_found",
		metadata: { id, date: new Date().toISOString() },
	}),
	dataNotFound: (key: string, persistenceType?: string): ResultError => ({
		code: "Task.DataNotPersisted",
		message: `No data found for the key: ${key}`,
		type: "Not_found",
		metadata: { persistenceType, key, date: new Date().toISOString() },
	}),
	corruptedData: (key: string, persistenceType?: string): ResultError => ({
		code: "Task.StorageCorrupted",
		message: `Data validation failed for the key: ${key}`,
		type: "Internal",
		metadata: { persistenceType, key, date: new Date().toISOString() },
	}),
};
