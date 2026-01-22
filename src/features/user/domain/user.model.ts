import { Result } from "@/shared/domain/result";
import { userValidationErrors } from "./user.errors";

export const USER_SESSION_TYPES = {
	DEMO: "DEMO",
	REGISTER: "REGISTER",
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
		return Result.Error([
			userValidationErrors.invalidSessionType(
				data.id || "undefined",
				data.sessionType,
			),
		]);

	if (data.sessionType === USER_SESSION_TYPES.REGISTER && !data.id)
		return Result.Error([
			userValidationErrors.requiredIdForRegisteredUser(data.sessionType),
		]);

	if (data.sessionType === USER_SESSION_TYPES.REGISTER && !data.email)
		return Result.Error([
			userValidationErrors.invalidEmailForRegisteredUser(
				data.id || "undefined",
			),
		]);

	if (!Object.values(USER_THEME_TYPES).includes(data.theme))
		return Result.Error([
			userValidationErrors.invalidTheme(data.id || "undefined", data.theme),
		]);

	return Result.Success({
		sessionType: data.sessionType,
		id: data.id || crypto.randomUUID(),
		email: data.email,
		theme: data.theme,
	});
};
