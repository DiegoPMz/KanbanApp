import { httpClient } from "@/shared/api/httpClient";
import { Result } from "@/shared/lib/result";
import { userIdErrors, userThemeErrors } from "../domain/user.errors";
import { SESSION_TYPES, UserModel } from "../domain/user.model";
import { IUserRepository } from "../domain/user.repository";
import { User } from "./../domain/user.model";

interface UserEntity {
	id: string;
	email: string;
	appTheme: UserModel["theme"];
}

export const apiUserRepository: IUserRepository = {
	getDetails: async (): Promise<Result<UserModel>> => {
		try {
			const { data } = await httpClient.get<UserEntity>("/user/details");
			const mappedUser = User({
				id: data.id,
				email: data.email,
				theme: data.appTheme,
				sessionType: SESSION_TYPES.REGISTER,
			});

			if (mappedUser.isSuccess) return Result.Success(mappedUser.value);

			return Result.Error([...mappedUser.errors]);
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
		if (!userData.id || !userData.theme)
			return Result.Error([
				{
					code: userIdErrors.code,
					message: userIdErrors.messages.registeredWithoutId,
				},
				{
					code: userThemeErrors.code,
					message: userThemeErrors.messages.empty,
				},
			]);

		try {
			await httpClient.put<string>(`/user/theme/${userData.theme}`);
			return Result.Success(userData);
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
};
