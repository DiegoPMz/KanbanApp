import { AppError } from "@/shared/lib/result";

/**
 * Errores de Dominio / Validación
 * Se disparan cuando la lógica de la entidad Task es violada.
 */
export const taskValidationError = {
	emptyTitle: (id: string): AppError => ({
		code: "TASK_TITLE_EMPTY",
		message: "Task title cannot be empty.",
		details: { id, date: new Date().toISOString() },
	}),
	tooLongTitle: (id: string): AppError => ({
		code: "TASK_TITLE_TOO_LONG",
		message: "Task title cannot exceed 200 characters.",
		details: { id, date: new Date().toISOString() },
	}),
	invalidPriority: (id: string, priority: string): AppError => ({
		code: "TASK_PRIORITY_INVALID",
		message: "Task priority must be one of: low, medium, high.",
		details: { id, priority, date: new Date().toISOString() },
	}),
	negativePosition: (id: string, position: number): AppError => ({
		code: "TASK_POSITION_NEGATIVE",
		message: "Task position cannot be negative.",
		details: { id, position, date: new Date().toISOString() },
	}),
	invalidPosition: (id: string, position: number): AppError => ({
		code: "TASK_POSITION_INVALID",
		message: "Task position must be a valid number.",
		details: { id, position, date: new Date().toISOString() },
	}),
	positionTooHigh: (id: string, position: number): AppError => ({
		code: "TASK_POSITION_TOO_HIGH",
		message: "Task position is higher than allowed.",
		details: { id, position, date: new Date().toISOString() },
	}),
	invalidId: (id: string): AppError => ({
		code: "TASK_ID_INVALID",
		message: "Task ID must be valid.",
		details: { id, date: new Date().toISOString() },
	}),
	invalidColumnId: (id: string): AppError => ({
		code: "TASK_COLUMN_ID_INVALID",
		message: "Task Column ID must be valid.",
		details: { id, date: new Date().toISOString() },
	}),
	invalidSubtaskIds: (id: string): AppError => ({
		code: "TASK_SUBTASK_IDS_INVALID",
		message: "Task subtask IDs must be a valid array of strings.",
		details: { id, date: new Date().toISOString() },
	}),
	invalidCompletionStatus: (id: string): AppError => ({
		code: "TASK_COMPLETION_STATUS_INVALID",
		message: "Task completion status must be a boolean.",
		details: { id, date: new Date().toISOString() },
	}),
};

/**
 * Errores de Persistencia / Repositorio
 * Se disparan cuando hay problemas al obtener o guardar los datos.
 */
export const taskPersistenceErrors = {
	notFound: (id: string): AppError => ({
		code: "TASK_NOT_FOUND",
		message: `Task not found with the id: ${id}`,
		details: { id, date: new Date().toISOString() },
	}),
	dataNotFound: (key: string, type?: string): AppError => ({
		code: "TASK_DATA_NOT_PERSISTED",
		message: `No data found for the key: ${key}`,
		details: { type, key, date: new Date().toISOString() },
	}),
	corruptedData: (key: string, reason: string, type?: string): AppError => ({
		code: "TASK_STORAGE_CORRUPTED",
		message: `Data validation failed for the key: ${key}`,
		details: { type, key, reason, date: new Date().toISOString() },
	}),
};
