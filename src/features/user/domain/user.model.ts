import { Result } from "@/shared/lib/result";
import {
	userEmailErrors,
	userIdErrors,
	userSessionTypeErrors,
	userThemeErrors,
} from "./user.errors";

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
	if (!Object.values(SESSION_TYPES).includes(data.sessionType))
		return Result.Error([
			{
				code: userSessionTypeErrors.code,
				message: userSessionTypeErrors.messages.invalid,
			},
		]);

	if (data.sessionType === SESSION_TYPES.REGISTER && !data.id)
		return Result.Error([
			{
				code: userIdErrors.code,
				message: userIdErrors.messages.registeredWithoutId,
			},
		]);

	if (data.sessionType === SESSION_TYPES.REGISTER && !data.email)
		return Result.Error([
			{
				code: userEmailErrors.code,
				message: userEmailErrors.messages.registeredWithoutEmail,
			},
		]);

	if (!Object.values(THEME_TYPES).includes(data.theme))
		return Result.Error([
			{
				code: userThemeErrors.code,
				message: userThemeErrors.messages.invalid,
			},
		]);

	return Result.Success({
		sessionType: data.sessionType,
		id: data.id || crypto.randomUUID(),
		email: data.sessionType === SESSION_TYPES.REGISTER ? data.email : null,
		theme: data.theme,
	});
};
