import { Result } from "@/shared/lib/result";
import { SESSION_TYPES, User, UserModel } from "../domain/user.model";
import { IUserRepository } from "../domain/user.repository";

const USER_STORAGE_KEY = "DEMO_KANBAN_USER";

export const sessionStorageUserRepository: IUserRepository = {
	getDetails: async (): Promise<Result<UserModel>> => {
		try {
			const rawUser = sessionStorage.getItem(USER_STORAGE_KEY);
			if (!rawUser) {
				return Result.Error([
					{
						message: "No user found in session storage",
						code: "UserNotFound",
					},
				]);
			}

			const persistedUser = JSON.parse(rawUser) as UserModel;
			const userMapper = User({
				email: persistedUser?.email,
				theme: persistedUser?.theme,
				id: persistedUser?.id,
				sessionType: persistedUser?.sessionType,
			});

			if (userMapper.isSuccess) return Result.Success(userMapper.value);

			return Result.Error([...userMapper.errors]);
		} catch (error) {
			return Result.Error([
				{
					message: "Unexpected error",
					code: "UnexpectedError",
					details: error,
				},
			]);
		}
	},

	save: async (userData: UserModel): Promise<Result<UserModel>> => {
		const rawUser = sessionStorage.getItem(USER_STORAGE_KEY);
		if (rawUser) {
			try {
				const persistedUser = JSON.parse(rawUser) as UserModel;
				const userMapper = User({
					...persistedUser,
					theme: userData.theme ?? persistedUser.theme,
					id: persistedUser.id,
					sessionType: SESSION_TYPES.DEMO,
				});

				if (userMapper.isSuccess) return Result.Success(userMapper.value);
				return Result.Error([...userMapper.errors]);
			} catch (error) {
				return Result.Error([
					{
						message: "Unexpected error",
						code: "UnexpectedError",
						details: error,
					},
				]);
			}
		}

		const newUser = User({
			email: null,
			theme: userData.theme,
			sessionType: SESSION_TYPES.DEMO,
		});
		if (!newUser.isSuccess) return Result.Error([...newUser.errors]);

		sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser.value));
		return Result.Success(newUser.value);
	},
};
