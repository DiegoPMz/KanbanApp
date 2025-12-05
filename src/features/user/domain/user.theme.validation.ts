import { Result } from "@/shared/lib/result";
import { userThemeErrors } from "./user.errors";
import { THEME_TYPES, UserModel } from "./user.model";

export const validateTheme = (
	theme: UserModel["theme"],
): Result<UserModel["theme"]> => {
	if (!theme || theme.trim().length === 0)
		return Result.Error([
			{
				code: userThemeErrors.code,
				message: userThemeErrors.messages.empty,
				details: { theme },
			},
		]);

	if (!Object.values(THEME_TYPES).includes(theme))
		return Result.Error([
			{
				code: userThemeErrors.code,
				message: userThemeErrors.messages.invalid,
				details: { theme },
			},
		]);

	return Result.Success(theme);
};
