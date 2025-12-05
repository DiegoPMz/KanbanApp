import { Result } from "@/shared/lib/result";
import { userSessionTypeErrors } from "./user.errors";
import { SESSION_TYPES, UserModel } from "./user.model";

export const validateSessionType = (
	sessionType: UserModel["sessionType"],
	id?: UserModel["id"],
): Result<UserModel["sessionType"]> => {
	if (!sessionType || !Object.values(SESSION_TYPES).includes(sessionType))
		return Result.Error([
			{
				code: userSessionTypeErrors.code,
				message: userSessionTypeErrors.messages.invalid,
				details: { sessionType },
			},
		]);

	if (sessionType === SESSION_TYPES.REGISTER && !id)
		return Result.Error([
			{
				code: userSessionTypeErrors.code,
				message: userSessionTypeErrors.messages.registeredWithoutId,
				details: { sessionType, id },
			},
		]);

	return Result.Success(sessionType);
};
