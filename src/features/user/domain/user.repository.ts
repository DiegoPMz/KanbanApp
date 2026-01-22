import { Result } from "@/shared/domain/result";
import { UserModel } from "./user.model";

export interface IUserRepository {
	getDetails: () => Promise<Result<UserModel>>;
	update: (userData: UserModel) => Promise<Result<UserModel>>;
}
