import { AppError } from "@/shared/lib/result";

/**
 * Errores de Dominio / Validación
 * Se disparan cuando la lógica de la entidad Column es violada.
 */
export const columnValidationErrors = {
	emptyName: (id: string): AppError => ({
		code: "COLUMN_NAME_EMPTY",
		message: "Column name cannot be empty.",
		details: { id, date: new Date().toISOString() },
	}),
	tooLongName: (id: string): AppError => ({
		code: "COLUMN_NAME_TOO_LONG",
		message: "Column name cannot exceed 100 characters.",
		details: { id, date: new Date().toISOString() },
	}),
	invalidId: (id: string): AppError => ({
		code: "COLUMN_ID_INVALID",
		message: "Column ID must be valid.",
		details: { id, date: new Date().toISOString() },
	}),
	invalidBoardId: (id: string, boardId: string): AppError => ({
		code: "COLUMN_BOARD_ID_INVALID",
		message: "Column board ID must be a valid id.",
		details: { id, boardId, date: new Date().toISOString() },
	}),
	negativePosition: (id: string, position: number): AppError => ({
		code: "COLUMN_POSITION_NEGATIVE",
		message: "Column position cannot be negative.",
		details: { id, position, date: new Date().toISOString() },
	}),
	invalidPosition: (id: string, position: number): AppError => ({
		code: "COLUMN_POSITION_INVALID",
		message: "Column position must be a valid number.",
		details: { id, position, date: new Date().toISOString() },
	}),
	positionTooHigh: (id: string, position: number): AppError => ({
		code: "COLUMN_POSITION_TOO_HIGH",
		message: "Column position is higher than allowed.",
		details: { id, position, date: new Date().toISOString() },
	}),
	invalidTaskIds: (id: string): AppError => ({
		code: "COLUMN_TASK_IDS_INVALID",
		message: "Column task IDs must be a valid array of strings.",
		details: { id, date: new Date().toISOString() },
	}),
	invalidColor: (id: string, color: string): AppError => ({
		code: "COLUMN_COLOR_INVALID",
		message: "Column color must be a valid hex color code.",
		details: { id, color, date: new Date().toISOString() },
	}),
};

/**
 * Errores de Persistencia / Repositorio
 * Se disparan cuando hay problemas al obtener o guardar los datos.
 */
export const columnPersistenceErrors = {
	notFound: (id: string): AppError => ({
		code: "COLUMN_NOT_FOUND",
		message: "Column not found.",
		details: { id, date: new Date().toISOString() },
	}),
	dataNotFound: (key: string, type?: string): AppError => ({
		code: "COLUMN_DATA_NOT_PERSISTED",
		message: `No data found for the key: ${key}`,
		details: { type, key, date: new Date().toISOString() },
	}),
	corruptedData: (key: string, reason: string, type?: string): AppError => ({
		code: "COLUMN_STORAGE_CORRUPTED",
		message: `Data validation failed for the key: ${key}`,
		details: { type, key, reason, date: new Date().toISOString() },
	}),
};
