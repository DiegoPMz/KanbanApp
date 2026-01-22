import { AppError } from "@/shared/domain/result";

/**
 * Errores de Dominio / Validación
 * Se disparan cuando la lógica de la entidad Board es violada.
 */
export const boardValidationErrors = {
	emptyName: (id: string): AppError => ({
		code: "BOARD_NAME_EMPTY",
		message: "Board name cannot be empty.",
		details: { id, date: new Date().toISOString() },
	}),
	tooLongName: (id: string): AppError => ({
		code: "BOARD_NAME_TOO_LONG",
		message: "Board name cannot exceed 100 characters.",
		details: { id, date: new Date().toISOString() },
	}),
	invalidId: (id: string): AppError => ({
		code: "BOARD_ID_INVALID",
		message: "Board ID must be a valid UUID.",
		details: { id, date: new Date().toISOString() },
	}),
	invalidColumnIds: (id: string): AppError => ({
		code: "BOARD_COLUMN_IDS_INVALID",
		message: "Board column IDs must be an array of strings.",
		details: { id, date: new Date().toISOString() },
	}),
};

/**
 * Errores de Persistencia / Repositorio
 * Se disparan cuando hay problemas al obtener o guardar los datos.
 */
export const boardRepositoryErrors = {
	notFound: (id: string): AppError => ({
		code: "BOARD_NOT_FOUND",
		message: `Board with ID ${id} not found.`,
		details: { boardId: id, date: new Date().toISOString() },
	}),
	dataNotFound: (key: string, type?: string): AppError => ({
		code: "BOARD_DATA_NOT_PERSISTED",
		message: `No data found for the key: ${key}`,
		details: { type, key, date: new Date().toISOString() },
	}),
	corruptedData: (key: string, reason: string, type?: string): AppError => ({
		code: "BOARD_STORAGE_CORRUPTED",
		message: `Data validation failed for the key: ${key}`,
		details: { type, key, reason, date: new Date().toISOString() },
	}),
};
