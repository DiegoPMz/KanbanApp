import { httpClient } from "@/shared/api/api.client";
import { Result } from "@/shared/lib/result";
import { AxiosError } from "axios";
import { IAuthRepository } from "../application/auth.repository";

export const apiAuthRepository: IAuthRepository = {
	logout: async () => {
		try {
			await httpClient.get<string>("/auth/logout");
			return Result.Success("Logout successfully");
		} catch (error) {
			if (error instanceof AxiosError)
				return Result.Error<string>([
					{
						message: error.message,
						code: error.code ?? error.name,
						details: error.cause,
					},
				]);

			return Result.Error<string>([
				{ message: " Unexpected error", code: "UnexpectedError" },
			]);
		}
	},
};
