import { ResultError } from "@/shared/domain/result";
import { USER_SESSION_TYPES } from "./user.model";

/**
 * Domain / Validation Errors
 * Triggered when the User entity's business logic is violated.
 */
export const userValidationErrors = {
	invalidTheme: (theme: string): ResultError => ({
		code: "User.InvalidTheme",
		message: `The theme '${theme}' is not valid.`,
		type: "Validation",
		metadata: { field: "theme", date: new Date().toISOString() },
	}),

	invalidSessionType: (sessionType: string): ResultError => ({
		code: "User.SessionTypeInvalid",
		message: `The session type '${sessionType}' is not valid.`,
		type: "Validation",
		metadata: { field: "sessionType", date: new Date().toISOString() },
	}),

	invalidId: (id: string): ResultError => ({
		code: "User.IdInvalid",
		message: `The user ID '${id}' is not valid.`,
		type: "Validation",
		metadata: { field: "id", date: new Date().toISOString() },
	}),
};

/**
 * Persistence / Repository Errors
 * Triggered when issues occur while retrieving or saving data.
 */
export const userRepositoryErrors = {
	notFound: (id: string): ResultError => ({
		code: "User.NotFound",
		message: `User not founded.`,
		type: "Not_found",
		metadata: { userId: id, date: new Date().toISOString() },
	}),

	dataNotFound: (key: string, persistenceType?: string): ResultError => ({
		code: "User.DataNotPersisted",
		message: `No data found for the key: ${key}`,
		type: "Internal",
		metadata: { persistenceType, key, date: new Date().toISOString() },
	}),

	corruptedData: (key: string, persistenceType?: string): ResultError => ({
		code: "User.StorageCorrupted",
		message: `Data validation failed for the key: ${key}.`,
		type: "Internal",
		metadata: { persistenceType, key, date: new Date().toISOString() },
	}),
};

/**
 * Business Rule Errors (Conflict)
 * Triggered when the request is valid but violates domain consistency rules
 * or the current state of the user's session.
 */
export const userBusinessErrors = {
	requiredIdForRegisteredUser: (): ResultError => ({
		code: "User.IdRequired",
		message: `A user ID is required for session type '${USER_SESSION_TYPES.BASE}'.`,
		type: "Conflict",
		metadata: { field: "id", date: new Date().toISOString() },
	}),

	requiredEmailForBaseSession: (): ResultError => ({
		code: "User.EmailRequired",
		message: `An email is required for session type '${USER_SESSION_TYPES.BASE}'.`,
		type: "Conflict",
		metadata: { field: "email", date: new Date().toISOString() },
	}),
};
