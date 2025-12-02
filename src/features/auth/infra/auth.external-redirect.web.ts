import { httpClient } from "@/shared/api/httpClient";
import { IExternalAuthRedirect } from "../application/auth.external-redirect";

export const externalRedirectWeb: IExternalAuthRedirect = {
	notifyRedirect: (): void => {
		window.location.href = `${httpClient.getUri()}/auth/login`;
	},
};
