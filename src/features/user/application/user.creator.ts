import { Result } from "@/shared/domain/result";
import { UserModel } from "../domain/user.model";

export interface IUserCreator {
	create(): Promise<Result<UserModel>>;
}
