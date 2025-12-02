import { user } from "@/features/user/domain/user.model";
import { IUserRepository } from "@/features/user/domain/user.repository";
import { Result } from "@/shared/lib/result";

interface LoginDemoDto {
	id: string;
}

type LoginDemoResponse = Promise<Result<LoginDemoDto>>;

export const loginDemo = (userRepository: IUserRepository) => {
	return {
		handle: async (): LoginDemoResponse => {
			const userPersisted = await userRepository.details();
			if (userPersisted.isSuccess)
				return Result.Success({ id: userPersisted.value.id });

			const demoUser = user({
				email: null,
				theme: "light",
				sessionType: "DEMO",
			});

			if (!demoUser.isSuccess) throw new Error("Failed to create demo user");

			const newUser = await userRepository.save(demoUser.value);
			return Result.Success({ id: newUser.value.id });
		},
	};
};
