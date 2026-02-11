import { resultHandler } from "@/shared/application/utils/result-handler";
import { appBaseDependencies } from "@/shared/infra/dependency-injection/app-dependencies.base";
import { useDependencyConfig } from "@/shared/infra/dependency-injection/dependency-configuration.context";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

export const getUserDetailsBaseOptions = queryOptions({
	queryKey: ["user"],
	queryFn: async () => {
		const result = await appBaseDependencies.user.getUserDetails.handle();
		return resultHandler("getUserDetails", result);
	},
});

export const useGetUserDetails = () => {
	const { appDependencies } = useDependencyConfig();

	return useSuspenseQuery({
		...getUserDetailsBaseOptions,
		queryFn: async () => {
			const result = await appDependencies.user.getUserDetails.handle();
			return resultHandler("getUserDetails", result);
		},
	});
};
