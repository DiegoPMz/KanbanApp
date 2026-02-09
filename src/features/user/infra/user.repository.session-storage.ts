import { Result } from "@/shared/domain/result";
import {
	sessionDb,
	sessionDbKeys,
} from "@/shared/infra/persistence/session-storage.db";
import z from "zod";
import { userRepositoryErrors } from "../domain/user.errors";
import {
	USER_SESSION_TYPES,
	USER_THEME_TYPES,
	User,
	UserModel,
} from "../domain/user.model";
import { IUserRepository } from "../domain/user.repository";
import { globalErrors } from "@/shared/domain/errors/global.error";

export const sessionStorageUserRepository: IUserRepository = {
	getDetails: async (): Promise<Result<UserModel>> => loadPersistedUser(),

	update: async (userData: UserModel): Promise<Result<UserModel>> => {
		const currentUser = await loadPersistedUser();
		if (!currentUser.isSuccess) return currentUser;

		const updatedUser = User({
			id: currentUser.value.id,
			sessionType: USER_SESSION_TYPES.DEMO,
			email: null,
			theme: userData.theme ?? currentUser.value.theme,
		});

		if (updatedUser.isSuccess) sessionDb.user.save(updatedUser.value);
		return updatedUser;
	},
};

const userSessionStorageSchema: z.ZodType<UserModel> = z.object({
	id: z.string(),
	email: z.null(),
	theme: z.enum(Object.values(USER_THEME_TYPES)),
	sessionType: z.literal(USER_SESSION_TYPES.DEMO),
});

const loadPersistedUser = async (): Promise<Result<UserModel>> => {
	const userPersisted = sessionDb.user.get();
	if (!userPersisted) return Result.Failure([globalErrors.authentication()]);

	const validation =
		await userSessionStorageSchema.safeParseAsync(userPersisted);

	if (validation.success) return User(validation.data);
	sessionDb.user.clear();

	return Result.Failure([
		userRepositoryErrors.corruptedData(sessionDbKeys.user, "SESSION_STORAGE"),
	]);
};
