import { Result } from "@/shared/domain/result";
import { userBusinessErrors, userValidationErrors } from "./user.errors";

export const USER_SESSION_TYPES = {
	DEMO: "DEMO",
	BASE: "BASE",
} as const;

export const USER_THEME_TYPES = {
	LIGHT: "Light",
	DARK: "Dark",
} as const;

export interface UserModel {
	id: string;
	email: string | null;
	theme: (typeof USER_THEME_TYPES)[keyof typeof USER_THEME_TYPES];
	sessionType: keyof typeof USER_SESSION_TYPES;
}

type UserInput = Omit<UserModel, "id"> & { id?: string };

export const User = (data: UserInput): Result<UserModel> => {
	if (!Object.values(USER_SESSION_TYPES).includes(data.sessionType))
		return Result.Failure([
			userValidationErrors.invalidSessionType(data.sessionType),
		]);

	if (data.sessionType === USER_SESSION_TYPES.BASE && !data.id)
		return Result.Failure([userBusinessErrors.requiredIdForRegisteredUser()]);

	if (data.sessionType === USER_SESSION_TYPES.BASE && !data.email)
		return Result.Failure([userBusinessErrors.requiredEmailForBaseSession()]);

	if (!Object.values(USER_THEME_TYPES).includes(data.theme))
		return Result.Failure([userValidationErrors.invalidTheme(data.theme)]);

	return Result.Success({
		sessionType: data.sessionType,
		id: data.id || crypto.randomUUID(),
		email: data.email,
		theme: data.theme,
	});
};
