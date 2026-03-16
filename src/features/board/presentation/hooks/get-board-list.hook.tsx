import { resultHandler } from "@/shared/application/utils/result-handler";
import {
	AppDependencies,
	useDependencyConfig,
} from "@/shared/infra/dependency-injection/dependency-configuration.context";
import {
	infiniteQueryOptions,
	useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { BoardListDto } from "../../application/board.list.use-case";

export const getBoardListQueryKey = ["board", "list"] as const;

export const getBoardListBaseOptions = (
	boardListDep: AppDependencies["board"]["boardList"],
	dto: BoardListDto,
) =>
	infiniteQueryOptions({
		queryKey: [...getBoardListQueryKey, dto],
		queryFn: async ({ pageParam }: { pageParam: BoardListDto["cursor"] }) => {
			const result = await boardListDep.handle({ ...dto, cursor: pageParam });
			return resultHandler("getBoardDetails", result);
		},
		initialPageParam: undefined as BoardListDto["cursor"],
		getNextPageParam: (lastPage) => {
			if (lastPage.nextCursor === null) {
				return undefined;
			}

			return lastPage.nextCursor;
		},
		select: (data) => data.pages.flatMap((page) => page.items),
	});

export const useGetBoardList = (dto: BoardListDto) => {
	const { appDependencies } = useDependencyConfig();

	return useSuspenseInfiniteQuery({
		...getBoardListBaseOptions(appDependencies.board.boardList, dto),
	});
};
