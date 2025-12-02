import { Result } from "@/shared/lib/result";

export interface IAuthRepository {
	logout: () => Promise<Result<string>>;
}
