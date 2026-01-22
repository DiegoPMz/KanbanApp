import { AppError } from "@/shared/domain/result";

/**
 * Errores de Dominio / Validación
 * Se disparan cuando la lógica de la entidad SubTask es violada.
 */
export const subTaskValidationError = {
	invalidTaskId: (id: string): AppError => ({
		code: "SUBTASK_INVALID_TASK_ID",
		message: `Invalid taskId for SubTask with id: ${id}`,
		details: { id, date: new Date().toISOString() },
	}),
	emptyDescription: (id: string): AppError => ({
		code: "SUBTASK_EMPTY_DESCRIPTION",
		message: `Description cannot be empty for SubTask with id: ${id}`,
		details: { id, date: new Date().toISOString() },
	}),
	tooLongDescription: (id: string): AppError => ({
		code: "SUBTASK_TOO_LONG_DESCRIPTION",
		message: `SubTask description cannot exceed 500 characters for SubTask with id: ${id}`,
		details: { id, date: new Date().toISOString() },
	}),
	invalidIsCompleted: (id: string): AppError => ({
		code: "SUBTASK_INVALID_IS_COMPLETED",
		message: `isCompleted must be a boolean for SubTask with id: ${id}`,
		details: { id, date: new Date().toISOString() },
	}),
	invalidId: (id: string): AppError => ({
		code: "SUBTASK_INVALID_ID",
		message: `Invalid id for SubTask: ${id}`,
		details: { id, date: new Date().toISOString() },
	}),
};

/**
 * Errores de Persistencia / Repositorio
 * Se disparan cuando hay problemas al obtener o guardar los datos.
 */
export const subTaskPersistenceErrors = {
	notFound: (id: string): AppError => ({
		code: "SUBTASK_NOT_FOUND",
		message: `SubTask not found with the id: ${id}`,
		details: { id, date: new Date().toISOString() },
	}),
	dataNotFound: (key: string, type?: string): AppError => ({
		code: "SUBTASK_DATA_NOT_PERSISTED",
		message: `No data found for the key: ${key}`,
		details: { type, key, date: new Date().toISOString() },
	}),
	corruptedData: (key: string, reason: string, type?: string): AppError => ({
		code: "SUBTASK_STORAGE_CORRUPTED",
		message: `Data validation failed for the key: ${key}`,
		details: { type, key, reason, date: new Date().toISOString() },
	}),
};
