import { AppError } from "@/shared/domain/result";
/**
 * Errores de Dominio / Validación
 * Se disparan cuando la lógica de la entidad User es violada.
 */
export const userValidationErrors = {
	invalidTheme: (id: string, theme: string): AppError => ({
		code: "USER_THEME_INVALID",
		message: `The theme '${theme}' is not valid.`,
		details: { id, date: new Date().toISOString() },
	}),
	invalidSessionType: (id: string, sessionType: string): AppError => ({
		code: "USER_SESSION_TYPE_INVALID",
		message: `The session type '${sessionType}' is not valid.`,
		details: { id, date: new Date().toISOString() },
	}),
	invalidId: (id: string): AppError => ({
		code: "USER_ID_INVALID",
		message: `The user ID '${id}' is not valid.`,
		details: { id, date: new Date().toISOString() },
	}),
	requiredIdForRegisteredUser: (sessionType: string): AppError => ({
		code: "USER_ID_REQUIRED",
		message: `A user ID is required for session type '${sessionType}'.`,
		details: { sessionType, date: new Date().toISOString() },
	}),
	invalidEmailForRegisteredUser: (id: string): AppError => ({
		code: "USER_EMAIL_INVALID",
		message: `Registered user with ID '${id}' must have a valid email.`,
		details: { id, date: new Date().toISOString() },
	}),
};

/**
 * Errores de Persistencia / Repositorio
 * Se disparan cuando hay problemas al obtener o guardar los datos.
 */
export const userRepositoryErrors = {
	notFound: (id: string): AppError => ({
		code: "USER_NOT_FOUND",
		message: `User with ID ${id} not found.`,
		details: { userId: id, date: new Date().toISOString() },
	}),
	dataNotFound: (key: string, type?: string): AppError => ({
		code: "USER_DATA_NOT_PERSISTED",
		message: `No data found for the key: ${key}`,
		details: { type, key, date: new Date().toISOString() },
	}),
	corruptedData: (key: string, reason: string, type?: string): AppError => ({
		code: "USER_STORAGE_CORRUPTED",
		message: `Data validation failed for the key: ${key}`,
		details: { type, key, reason, date: new Date().toISOString() },
	}),
};
