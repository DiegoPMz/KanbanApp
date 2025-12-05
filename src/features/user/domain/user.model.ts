import { AppError, Result } from "@/shared/lib/result";
import { validateEmail } from "./user.email.validation";
import { validateId } from "./user.id.validation";
import { validateSessionType } from "./user.session-type.validation";
import { validateTheme } from "./user.theme.validation";

export const SESSION_TYPES = {
	DEMO: "DEMO",
	REGISTER: "REGISTER",
} as const;

export const THEME_TYPES = {
	LIGHT: "Light",
	DARK: "Dark",
} as const;

export interface UserModel {
	id: string;
	email: string | null;
	theme: (typeof THEME_TYPES)[keyof typeof THEME_TYPES];
	sessionType: keyof typeof SESSION_TYPES;
}

type UserInput = Omit<UserModel, "id"> & { id?: string };

export const User = (data: UserInput): Result<UserModel> => {
	const userErrors: AppError[] = [];

	const idOrError = validateId(data.sessionType, data.id);
	if (!idOrError.isSuccess) userErrors.push(idOrError.errors[0]);

	const emailOrError = validateEmail(data.email, data.id);
	if (!emailOrError.isSuccess) userErrors.push(emailOrError.errors[0]);

	const themeOrError = validateTheme(data.theme);
	if (!themeOrError.isSuccess) userErrors.push(themeOrError.errors[0]);

	const sessionTypeOrError = validateSessionType(data.sessionType, data.id);
	if (!sessionTypeOrError.isSuccess)
		userErrors.push(sessionTypeOrError.errors[0]);

	if (userErrors.length > 0) return Result.Error(userErrors);

	return Result.Success({
		id: idOrError.value || crypto.randomUUID(),
		email: emailOrError.value,
		theme: themeOrError.value,
		sessionType: sessionTypeOrError.value,
	});
};
