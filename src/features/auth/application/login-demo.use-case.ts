import {
	SESSION_TYPES,
	THEME_TYPES,
	User,
} from "@/features/user/domain/user.model";
import { IUserRepository } from "@/features/user/domain/user.repository";
import { Result } from "@/shared/lib/result";

interface LoginDemoDto {
	id: string;
}

type LoginDemoResponse = Result<LoginDemoDto>;

export const loginDemo = (userRepository: IUserRepository) => {
	return {
		handle: async (): Promise<LoginDemoResponse> => {
			const userPersisted = await userRepository.getDetails();
			if (userPersisted.isSuccess)
				return Result.Success({ id: userPersisted.value.id });

			const demoUser = User({
				email: null,
				theme: THEME_TYPES.LIGHT,
				sessionType: SESSION_TYPES.DEMO,
			});

			if (!demoUser.isSuccess) throw new Error("Failed to create demo user");

			const newUser = await userRepository.save(demoUser.value);
			return Result.Success({ id: newUser.value.id });
		},
	};
};
