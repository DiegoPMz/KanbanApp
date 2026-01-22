import { Result } from "@/shared/lib/result";
import { UserModel } from "../domain/user.model";

export interface IUserCreator {
	create(): Promise<Result<UserModel>>;
}
