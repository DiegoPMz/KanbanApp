import { resultHandler } from "@/shared/application/utils/result-handler";
import { appBaseDependencies } from "@/shared/infra/dependency-injection/app-dependencies.base";
import { useDependencyConfig } from "@/shared/infra/dependency-injection/dependency-configuration.context";
import { mutationOptions, useMutation } from "@tanstack/react-query";
import { UpdateUserDto } from "../../application/user.update.use-case";

export const updateUserBaseOptions = mutationOptions({
	mutationKey: ["user"],
	mutationFn: async (dto: UpdateUserDto) => {
		const result = await appBaseDependencies.user.updateUser.handle(dto);
		return resultHandler("updateUser", result);
	},
});

export const useUpdateUser = () => {
	const { appDependencies } = useDependencyConfig();

	return useMutation({
		...updateUserBaseOptions,
		mutationFn: async (dto: UpdateUserDto) => {
			const result = await appDependencies.user.updateUser.handle(dto);
			return resultHandler("updateUser", result);
		},
	});
};
