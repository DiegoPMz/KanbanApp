import { Result } from "@/shared/domain/result";
import { sessionDb } from "@/shared/infra/persistence/session-storage.db";
import { IUserCreator } from "../application/user.creator";
import {
	User,
	USER_SESSION_TYPES,
	USER_THEME_TYPES,
	UserModel,
} from "../domain/user.model";
import { userErrorCodes } from "../domain/user.errors";

export const sessionStorageUserCreator: IUserCreator = {
	create: async (): Promise<Result<UserModel>> => {
		const demoUser = User({
			id: "demo-user-id",
			sessionType: USER_SESSION_TYPES.DEMO,
			theme: USER_THEME_TYPES.LIGHT,
			email: null,
		});

		if (
			demoUser.isSuccess ||
			demoUser.errors[0].code === userErrorCodes.DataNotPersisted
		)
			sessionDb.user.save(demoUser.value);

		return demoUser;
	},
};
