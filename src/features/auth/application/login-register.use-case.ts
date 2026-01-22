import { Result } from "@/shared/domain/result";
import { IAuthService } from "./auth.service";

export const loginRegister = (authService: IAuthService) => {
	return {
		handle: async (): Promise<Result<void>> => {
			await authService.externalAuthRedirect();
			return Result.Success(undefined);
		},
	};
};
