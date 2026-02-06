import { ResultError } from "@/shared/domain/result";

/**
 * Domain / Validation Errors
 * Triggered when the SubTask entity's business logic is violated.
 */
export const subTaskValidationErrors = {
	invalidTaskId: (taskId: string, id?: string): ResultError => ({
		code: "SubTask.TaskIdInvalid",
		message: `Invalid taskId: ${taskId}`,
		type: "Validation",
		metadata: { id, taskId, date: new Date().toISOString() },
	}),
	emptyDescription: (id?: string): ResultError => ({
		code: "SubTask.DescriptionEmpty",
		message: "SubTask description cannot be empty.",
		type: "Validation",
		metadata: {
			id,
			field: "description",
			date: new Date().toISOString(),
		},
	}),
	tooLongDescription: (length: number, id?: string): ResultError => ({
		code: "SubTask.DescriptionTooLong",
		message: `SubTask description cannot exceed 500 characters. Current length: ${length}`,
		type: "Validation",
		metadata: {
			id,
			field: "description",
			maxLength: 500,
			date: new Date().toISOString(),
		},
	}),
	invalidIsCompleted: (id?: string): ResultError => ({
		code: "SubTask.IsCompletedInvalid",
		message: "isCompleted must be a boolean.",
		type: "Validation",
		metadata: {
			id,
			field: "isCompleted",
			date: new Date().toISOString(),
		},
	}),
	invalidId: (id: string): ResultError => ({
		code: "SubTask.IdInvalid",
		message: `The provided ID '${id}' is not a valid UUID.`,
		type: "Validation",
		metadata: { id, date: new Date().toISOString() },
	}),
};

/**
 * Persistence / Repository Errors
 * Triggered when issues occur while retrieving or saving data.
 */
export const subTaskPersistenceErrors = {
	notFound: (id: string): ResultError => ({
		code: "SubTask.NotFound",
		message: `SubTask not found with the id: ${id}`,
		type: "Not_found",
		metadata: { id, date: new Date().toISOString() },
	}),
	dataNotFound: (key: string, persistenceType?: string): ResultError => ({
		code: "SubTask.DataNotPersisted",
		message: `No data found for the key: ${key}`,
		type: "Not_found",
		metadata: { persistenceType, key, date: new Date().toISOString() },
	}),
	corruptedData: (key: string, persistenceType?: string): ResultError => ({
		code: "SubTask.StorageCorrupted",
		message: `Data validation failed for the key: ${key}`,
		type: "Internal",
		metadata: { persistenceType, key, date: new Date().toISOString() },
	}),
};
