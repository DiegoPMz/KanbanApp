import { getUserDetailsBaseOptions } from "@/features/user/presentation/hooks/get-user-details.hook";
import { errorTypes } from "@/shared/domain/result";
import { TanStackError } from "@/shared/infra/errors/tanstack-result.exception";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(register)/_authGuard")({
	beforeLoad: async ({ context, location }) => {
		const { queryClient, setBaseSessionType } = context;

		try {
			await queryClient.ensureQueryData(getUserDetailsBaseOptions);
			setBaseSessionType();
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
});
