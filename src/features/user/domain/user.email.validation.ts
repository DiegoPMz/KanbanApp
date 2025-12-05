import { Result } from "@/shared/lib/result";
import { userEmailErrors } from "./user.errors";
import { UserModel } from "./user.model";

export const validateEmail = (
	email: UserModel["email"],
	id?: UserModel["id"],
): Result<UserModel["email"]> => {
	if (!id && !email) return Result.Success(null);
	if (id && !email)
		return Result.Error([
			{
				code: userEmailErrors.code,
				message: userEmailErrors.messages.registeredWithoutEmail,
				details: { email, id },
			},
		]);

	return Result.Success(email);
};
