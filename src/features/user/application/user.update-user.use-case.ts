import { Result } from "@/shared/lib/result";
import { UserModel } from "../domain/user.model";
import { IUserRepository } from "../domain/user.repository";

export const updateUser = (userRepository: IUserRepository) => {
	return {
		handle: async (userData: UserModel): Promise<Result<UserModel>> => {
			const userResult = await userRepository.save(userData);
			if (userResult.isSuccess) return userResult;

			return Result.Error([...userResult.errors]);
		},
	};
};
