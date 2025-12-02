import { IExternalAuthRedirect } from "./auth.external-redirect";

export const login = (authRedirectPort: IExternalAuthRedirect) => {
	return {
		handle: () => {
			authRedirectPort.notifyRedirect();
		},
	};
};
