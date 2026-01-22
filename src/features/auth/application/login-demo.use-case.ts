import { IUserCreator } from "@/features/user";
import { Result } from "@/shared/domain/result";
import { IAuthService } from "./auth.service";

export const loginDemo = (
	authService: IAuthService,
	userCreator: IUserCreator,
) => {
	return {
		handle: async (): Promise<Result<void>> => {
			const demoUserResult = await userCreator.create();
			if (!demoUserResult.isSuccess) return Result.Error(demoUserResult.errors);

			await authService.externalAuthRedirect();
			return Result.Success(undefined);
		},
	};
};
