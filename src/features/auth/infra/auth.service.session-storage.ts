import { Result } from "@/shared/lib/result";
import { IAuthService } from "../application/auth.service";

export const sessionStorageAuthService = (
	externalAuthRedirect: () => void,
): IAuthService => ({
	externalAuthRedirect: async (): Promise<void> => externalAuthRedirect(),

	logout: async () => {
		sessionStorage.clear();
		return Result.Success("Logged out successfully");
	},
});
