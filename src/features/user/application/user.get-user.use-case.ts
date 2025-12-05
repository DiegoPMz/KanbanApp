import { Result } from "@/shared/lib/result";
import { UserModel } from "../domain/user.model";
import { IUserRepository } from "../domain/user.repository";

export const getUser = (userRepository: IUserRepository) => {
	return {
		handle: async (): Promise<Result<UserModel>> => {
			const userResult = await userRepository.getDetails();
			if (userResult.isSuccess) return userResult;

			return Result.Error([...userResult.errors]);
		},
	};
};
