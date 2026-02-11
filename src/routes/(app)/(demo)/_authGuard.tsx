import { getUserDetailsBaseOptions } from "@/features/user/presentation/hooks/get-user-details.hook";
import { resultHandler } from "@/shared/application/utils/result-handler";
import { errorTypes } from "@/shared/domain/result";
import { appDemoDependencies } from "@/shared/infra/dependency-injection/app-dependencies.demo";
import { TanStackError } from "@/shared/infra/errors/tanstack-result.exception";
import { GenericErrorView } from "@/shared/presentation/components/generic-error-view";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(demo)/_authGuard")({
	beforeLoad: async ({ context, location }) => {
		const { queryClient, setDemoSessionType } = context;

		try {
			await queryClient.ensureQueryData({
				...getUserDetailsBaseOptions,
				queryFn: async () => {
					const result = await appDemoDependencies.user.getUserDetails.handle();
					return resultHandler("getUserDetails", result);
				},
			});
			setDemoSessionType();
		} catch (error: unknown) {
			if (
				error instanceof TanStackError &&
				error.type === errorTypes.Authentication
			)
				throw redirect({
					to: "/login",
					search: { redirect: location.href },
				});

			throw error;
		}
	},
	errorComponent: GenericErrorView,
});
