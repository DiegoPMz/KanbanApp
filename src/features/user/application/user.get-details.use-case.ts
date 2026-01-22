import { Result } from "@/shared/lib/result";
import { UserModel } from "../domain/user.model";
import { IUserRepository } from "../domain/user.repository";

export const getUserDetails = (userRepository: IUserRepository) => {
	return {
		handle: (): Promise<Result<UserModel>> => userRepository.getDetails(),
	};
};
