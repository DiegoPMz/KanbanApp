import { Result } from "@/shared/lib/result";
import { UserModel } from "./user.model";

export interface IUserRepository {
	getDetails: () => Promise<Result<UserModel>>;
	save: (userData: UserModel) => Promise<Result<UserModel>>;
}
