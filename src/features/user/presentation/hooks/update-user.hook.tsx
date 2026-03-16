import { resultHandler } from "@/shared/application/utils/result-handler";
import {
	AppDependencies,
	useDependencyConfig,
} from "@/shared/infra/dependency-injection/dependency-configuration.context";
import {
	mutationOptions,
	QueryClient,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { UpdateUserDto } from "../../application/user.update.use-case";
import { getUserDetailsKey } from "./get-user-details.hook";

export const updateUserBaseOptions = (
	queryClient: QueryClient,
	updateUserDep: AppDependencies["user"]["updateUser"],
) =>
	mutationOptions({
		mutationFn: async (dto: UpdateUserDto) => {
			const result = await updateUserDep.handle(dto);
			return resultHandler("updateUser", result);
		},
		onSuccess: (data) => {
			queryClient.setQueryData(getUserDetailsKey, data);
		},
	});

export const useUpdateUser = () => {
	const { appDependencies } = useDependencyConfig();
	const queryClient = useQueryClient();

	return useMutation({
		...updateUserBaseOptions(queryClient, appDependencies.user.updateUser),
	});
};
