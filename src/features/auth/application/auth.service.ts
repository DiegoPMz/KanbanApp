import { Result } from "@/shared/domain/result";

export interface IAuthService {
	logout: () => Promise<Result<string>>;
	externalAuthRedirect(): Promise<void>;
}
