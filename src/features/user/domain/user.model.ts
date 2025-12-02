import { Result } from "@/shared/lib/result";
import { z } from "zod";

export const SESSION_TYPES = {
	DEMO: "DEMO",
	REGISTER: "REGISTER",
} as const;

const UserSchema = z.object({
	id: z.uuid(),
	email: z.email().nullable(),
	theme: z.string().min(1),
	sessionType: z.enum(SESSION_TYPES),
});

export type UserModel = z.infer<typeof UserSchema>;

export const user = (
	data: Omit<UserModel, "id"> & { id?: string },
): Result<UserModel> => {
	const dataToValidate = {
		...data,
		id: data.id ?? crypto.randomUUID(),
	};

	const validationResult = UserSchema.safeParse(dataToValidate);

	if (!validationResult.success)
		return Result.Error<UserModel>([
			{ message: "Invalid user data", code: "INVALID_USER_DATA" },
		]);

	return Result.Success(validationResult.data);
};
