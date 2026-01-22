import { Result } from "@/shared/lib/result";
import { User, UserModel } from "../domain/user.model";
import { IUserRepository } from "../domain/user.repository";

interface UpdateUserDto {
	theme?: UserModel["theme"];
}

export const updateUser = (userRepository: IUserRepository) => {
	return {
		handle: async (data: UpdateUserDto): Promise<Result<UserModel>> => {
			const existingUserResult = await userRepository.getDetails();
			if (!existingUserResult.isSuccess)
				return Result.Error(existingUserResult.errors);

			const updatedUser = User({
				...existingUserResult.value,
				theme: data.theme ?? existingUserResult.value.theme,
			});

			return updatedUser.isSuccess
				? userRepository.update(updatedUser.value)
				: Result.Error(updatedUser.errors);
		},
	};
};
