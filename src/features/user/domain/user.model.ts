import { Result, ResultError } from "@/shared/domain/result";
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

// possible refactor

class UserId {
	public readonly value: string;

	private constructor(id: string) {
		this.value = id;
	}

	static create(): UserId {
		return new UserId(crypto.randomUUID());
	}

	static from(id: string): UserId {
		return new UserId(id);
	}
}

const internalUserValidations = (user: UserModel): ResultError[] => {
	const errors: ResultError[] = [];

	if (!Object.values(USER_SESSION_TYPES).includes(user.sessionType))
		errors.push(userValidationErrors.invalidSessionType(user.sessionType));

	if (user.sessionType === USER_SESSION_TYPES.BASE && !user.id)
		errors.push(userBusinessErrors.requiredIdForRegisteredUser());

	if (user.sessionType === USER_SESSION_TYPES.BASE && !user.email)
		errors.push(userBusinessErrors.requiredEmailForBaseSession());

	if (!Object.values(USER_THEME_TYPES).includes(user.theme))
		errors.push(userBusinessErrors.requiredEmailForBaseSession());

	return errors;
};

interface UserModelProperties {
	readonly id: string;
	readonly email: string | null;
	readonly theme: (typeof USER_THEME_TYPES)[keyof typeof USER_THEME_TYPES];
	readonly sessionType: keyof typeof USER_SESSION_TYPES;
}

export const user = {
	create: (
		id: UserId,
		email: string,
		theme?: UserModel["theme"],
	): Result<UserModelProperties> => {
		const user = {
			id: id.value,
			sessionType: USER_SESSION_TYPES.BASE,
			email,
			theme: theme ?? "Light",
		} as const;

		const errors = internalUserValidations(user);
		return errors.length > 0 ? Result.Failure(errors) : Result.Success(user);
	},

	createDemo: (
		id: UserId,
		theme?: UserModel["theme"],
	): Result<UserModelProperties> => {
		const user = {
			id: id.value,
			sessionType: USER_SESSION_TYPES.DEMO,
			email: null,
			theme: theme ?? "Light",
		} as const;

		const errors = internalUserValidations(user);
		return errors.length > 0 ? Result.Failure(errors) : Result.Success(user);
	},
};
