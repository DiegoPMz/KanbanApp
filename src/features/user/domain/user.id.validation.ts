import { Result } from "@/shared/lib/result";
import { userIdErrors } from "./user.errors";
import { UserModel } from "./user.model";

export const validateId = (
	sessionType: UserModel["sessionType"],
	id?: UserModel["id"],
): Result<typeof id> => {
	if (sessionType === "REGISTER" && !id)
		return Result.Error([
			{
				code: userIdErrors.code,
				message: userIdErrors.messages.registeredWithoutId,
				details: { sessionType, id },
			},
		]);

	return Result.Success(id);
};
