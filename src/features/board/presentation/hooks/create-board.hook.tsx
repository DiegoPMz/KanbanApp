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
import { CreateBoardDto } from "../../application/board.create.use-case";
import { getBoardListQueryKey } from "./get-board-list.hook";
import { getBoardDetailsQueryKey } from "./get-board-details.hook";

export const createBoardBaseOptions = (
	queryClient: QueryClient,
	createBoardDep: AppDependencies["board"]["createBoard"],
) =>
	mutationOptions({
		mutationFn: async (dto: CreateBoardDto) => {
			const result = await createBoardDep.handle(dto);
			return resultHandler("createBoard", result);
		},

		onSuccess: (data) => {
			queryClient.setQueryData(getBoardDetailsQueryKey(data.id), data);

			queryClient.invalidateQueries({
				queryKey: getBoardListQueryKey,
				exact: false,
			});
		},
	});

export const useCreateBoard = () => {
	const { appDependencies } = useDependencyConfig();
	const queryClient = useQueryClient();

	return useMutation({
		...createBoardBaseOptions(queryClient, appDependencies.board.createBoard),
	});
};
