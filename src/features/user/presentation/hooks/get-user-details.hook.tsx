import { resultHandler } from "@/shared/application/utils/result-handler";
import {
	AppDependencies,
	useDependencyConfig,
} from "@/shared/infra/dependency-injection/dependency-configuration.context";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

export const getUserDetailsKey = ["user"] as const;

export const getUserDetailsBaseOptions = (
	getUserDetailsDep: AppDependencies["user"]["getUserDetails"],
) =>
	queryOptions({
		queryKey: getUserDetailsKey,
		queryFn: async () => {
			const result = await getUserDetailsDep.handle();
			return resultHandler("getUserDetails", result);
		},
	});

export const useGetUserDetails = () => {
	const { appDependencies } = useDependencyConfig();

	return useSuspenseQuery({
		...getUserDetailsBaseOptions(appDependencies.user.getUserDetails),
	});
};
