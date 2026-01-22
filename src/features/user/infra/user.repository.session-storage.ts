import { Result } from "@/shared/lib/result";
import { parseData } from "@/shared/lib/utils";
import z from "zod";
import { userRepositoryErrors } from "../domain/user.errors";
import {
	USER_SESSION_TYPES,
	USER_THEME_TYPES,
	User,
	UserModel,
} from "../domain/user.model";
import { IUserRepository } from "../domain/user.repository";

const USER_STORAGE_KEY = "DEMO_KANBAN_USER";

export const sessionStorageUserRepository: IUserRepository = {
	getDetails: async (): Promise<Result<UserModel>> => await loadPersistedUser(),

	update: async (userData: UserModel): Promise<Result<UserModel>> => {
		const currentUser = await loadPersistedUser();
		if (!currentUser.isSuccess) return Result.Error(currentUser.errors);

		const updatedUser = User({
			id: currentUser.value.id,
			sessionType: USER_SESSION_TYPES.DEMO,
			email: currentUser.value.email,
			theme: userData.theme ?? currentUser.value.theme,
		});

		if (updatedUser.isSuccess)
			sessionStorage.setItem(
				USER_STORAGE_KEY,
				JSON.stringify(updatedUser.value),
			);

		return updatedUser;
	},
};

const userSessionStorageSchema = z.object({
	id: z.string(),
	email: z.null(),
	theme: z.enum(Object.values(USER_THEME_TYPES)),
	sessionType: z.literal(USER_SESSION_TYPES.DEMO),
});

type UserSessionStorage = z.infer<typeof userSessionStorageSchema>;

const loadPersistedUser = async (): Promise<Result<UserModel>> => {
	const persistedUser = parseData<UserSessionStorage>(
		sessionStorage.getItem(USER_STORAGE_KEY) as string,
	);
	if (!persistedUser)
		return Result.Error([
			userRepositoryErrors.dataNotFound(USER_STORAGE_KEY, "SESSION"),
		]);

	const validation =
		await userSessionStorageSchema.safeParseAsync(persistedUser);

	if (!validation.success)
		return Result.Error([
			userRepositoryErrors.corruptedData(USER_STORAGE_KEY, "SESSION"),
		]);

	return User({
		id: persistedUser.id,
		email: persistedUser.email,
		theme: persistedUser.theme,
		sessionType: persistedUser.sessionType,
	});
};
