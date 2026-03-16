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
import { DeleteBoardDto } from "../../application/board.delete.use-case";
import { getBoardDetailsQueryKey } from "./get-board-details.hook";
import { getBoardListQueryKey } from "./get-board-list.hook";

export const deleteBoardBaseOptions = (
	queryClient: QueryClient,
	deleteBoardDep: AppDependencies["board"]["deleteBoard"],
) =>
	mutationOptions({
		mutationFn: async (dto: DeleteBoardDto) => {
			const result = await deleteBoardDep.handle(dto);
			return resultHandler("deleteBoard", result);
		},

		onSuccess: (data) => {
			queryClient.removeQueries({
				exact: true,
				queryKey: getBoardDetailsQueryKey(data.id),
				type: "all",
			});

			queryClient.invalidateQueries({
				queryKey: getBoardListQueryKey,
				exact: false,
			});
		},
	});

export const useDeleteBoard = () => {
	const { appDependencies } = useDependencyConfig();
	const queryClient = useQueryClient();

	return useMutation({
		...deleteBoardBaseOptions(queryClient, appDependencies.board.deleteBoard),
	});
};
