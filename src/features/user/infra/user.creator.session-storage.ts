import { Result } from "@/shared/domain/result";
import { IUserCreator } from "../application/user.creator";
import {
	User,
	USER_SESSION_TYPES,
	USER_THEME_TYPES,
	UserModel,
} from "../domain/user.model";

export const sessionStorageUserCreator: IUserCreator = {
	create: (): Promise<Result<UserModel>> => {
		const demoUser = User({
			id: "demo-user-id",
			sessionType: USER_SESSION_TYPES.DEMO,
			theme: USER_THEME_TYPES.LIGHT,
			email: null,
		});

		if (demoUser.isSuccess)
			sessionStorage.setItem("USER_APP_DEMO", JSON.stringify(demoUser.value));

		return Promise.resolve(demoUser);
	},
};
