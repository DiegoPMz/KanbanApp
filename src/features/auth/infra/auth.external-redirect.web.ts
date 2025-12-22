import { httpClient } from "@/shared/api/api.client";
import { IExternalAuthRedirect } from "../application/auth.external-redirect";

export const externalRedirectWeb: IExternalAuthRedirect = {
	notifyRedirect: (): void => {
		window.location.href = `${httpClient.getUri()}/auth/login`;
	},
};
