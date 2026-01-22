import { Result } from "@/shared/lib/result";

export interface IAuthService {
	logout: () => Promise<Result<string>>;
	externalAuthRedirect(): Promise<void>;
}
