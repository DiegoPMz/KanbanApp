import { httpClient } from "@/shared/api/api.client";
import { HttpClientErrorResponse } from "@/shared/api/http-error.interceptor";
import { Result } from "@/shared/lib/result";
import { IAuthService } from "../application/auth.service";

export const apiAuthService = (): IAuthService => ({
	externalAuthRedirect: async (): Promise<void> =>
		window.location.replace(`${httpClient.getUri()}/auth/login`),

	logout: () =>
		httpClient
			.get<string>("/auth/logout")
			.then((res) => Result.Success(res.data))
			.catch((error: HttpClientErrorResponse) =>
				Result.Error([
					{
						code: "LOGOUT_ERROR",
						message:
							error.response?.data?.detail || "An error occurred during logout",
						details: { date: new Date().toISOString() },
					},
				]),
			),
});
