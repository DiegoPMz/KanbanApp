import { Result } from "@/shared/lib/result";
import { UserModel } from "./user.model";

export interface IUserRepository {
	details: () => Promise<Result<UserModel>>;
	save: (user: UserModel) => Promise<Result<UserModel>>;
}
