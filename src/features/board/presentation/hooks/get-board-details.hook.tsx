import { resultHandler } from "@/shared/application/utils/result-handler";
import {
	AppDependencies,
	useDependencyConfig,
} from "@/shared/infra/dependency-injection/dependency-configuration.context";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

export const getBoardDetailsQueryKey = (boardId: string) =>
	["board", "details", { boardId }] as const;

export const getBoardDetailsBaseOptions = (
	getBoardDetailsDep: AppDependencies["board"]["getBoardDetails"],
	boardId: string,
) =>
	queryOptions({
		queryKey: getBoardDetailsQueryKey(boardId),
		queryFn: async () => {
			const result = await getBoardDetailsDep.handle(boardId);
			return resultHandler("getBoardDetails", result);
		},
	});

export const useGetBoardDetails = (boardId: string) => {
	const { appDependencies } = useDependencyConfig();

	return useSuspenseQuery({
		...getBoardDetailsBaseOptions(
			appDependencies.board.getBoardDetails,
			boardId,
		),
	});
};
