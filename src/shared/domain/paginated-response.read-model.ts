/**
 * Read Model for Cursor-Based Pagination.
 */
export interface PaginatedResponse<T> {
	items: T[];
	/**
	 * The pointer for the next set of results.
	 * * `string`: An encoded token representing the position of the last item.
	 * Should be sent back in the next request.
	 * - `null`: Explicitly indicates that the end of the collection has been
	 * reached. No more data is available.
	 * - `undefined`: The cursor was not provided or is not applicable for
	 * this specific query.
	 */
	nextCursor?: string | null;
	hasNextPage: boolean;
	totalCount?: number;
}
