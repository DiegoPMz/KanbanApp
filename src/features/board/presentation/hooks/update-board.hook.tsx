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
import { UpdateBoardDto } from "../../application/board.update.use-case";
import { getBoardDetailsQueryKey } from "./get-board-details.hook";
import { getBoardListQueryKey } from "./get-board-list.hook";

export const updateBoardBaseOptions = (
	queryClient: QueryClient,
	updateBoardDep: AppDependencies["board"]["updateBoard"],
) =>
	mutationOptions({
		mutationFn: async (dto: UpdateBoardDto) => {
			const result = await updateBoardDep.handle(dto);
			return resultHandler("updateBoard", result);
		},

		onSuccess: (data) => {
			queryClient.setQueryData(getBoardDetailsQueryKey(data.id), data);

			queryClient.invalidateQueries({
				queryKey: getBoardListQueryKey,
				exact: false,
			});
		},
	});

export const useUpdateBoard = () => {
	const { appDependencies } = useDependencyConfig();
	const queryClient = useQueryClient();

	return useMutation({
		...updateBoardBaseOptions(queryClient, appDependencies.board.updateBoard),
	});
};
