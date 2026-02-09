import { Result } from "@/shared/domain/result";
import { HttpClientErrorResponse } from "@/shared/infra/http/axios-error.interceptor";
import { httpClient } from "@/shared/infra/http/http.client";
import { IAuthService } from "../application/auth.service";
import { mapGlobalHttpError } from "@/shared/infra/http/global-error.mapper";

export const apiAuthService = (): IAuthService => ({
	externalAuthRedirect: async (): Promise<void> =>
		window.location.replace(`${httpClient.getUri()}/auth/login`),

	logout: () =>
		httpClient
			.get<string>("/auth/logout")
			.then((res) => Result.Success(res.data))
			.catch((error: HttpClientErrorResponse) => {
				const global = mapGlobalHttpError(error);
				if (global) return Result.Failure([global]);

				return Result.Failure([
					{
						code: "LOGOUT_ERROR",
						message:
							error.response?.data?.detail || "An error occurred during logout",
						type: "Internal",
						metadata: { date: new Date().toISOString() },
					},
				]);
			}),
});
