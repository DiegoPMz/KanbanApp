import { columnValidationErrors } from "./column.errors";
import { Column } from "./column.model";

describe("feature:Column --> ColumnModel", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-02-06T08:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test(`Should return an error with code 'Column.NameEmpty' if the column has a nullish name`, () => {
		const mockedName = undefined as unknown as string;

		const result = Column({
			name: mockedName,
			position: 0,
			boardId: "some-board-id",
			taskIds: [],
		});

		expect(result.errors[0]).toEqual(
			expect.objectContaining(columnValidationErrors.emptyName()),
		);
	});

	test(`Should return an error with code 'Column.BoardIdInvalid' if the property boardId is nullish`, () => {
		const mockedBoardId = undefined as unknown as string;
		const result = Column({
			name: "Random name",
			position: 0,
			boardId: mockedBoardId,
			taskIds: [],
		});

		expect(result.errors[0]).toEqual(
			expect.objectContaining(
				columnValidationErrors.invalidBoardId(mockedBoardId),
			),
		);
	});

	test(`Should return an error with code 'Column.PositionInvalid' if the property is not a number`, () => {
		const mockedId = "some-id";
		const mockedPosition = "invalid position" as unknown as number;
		const result = Column({
			id: mockedId,
			name: "Random name",
			position: mockedPosition,
			boardId: "board-id",
			taskIds: [],
		});

		expect(result.errors[0]).toEqual(
			expect.objectContaining(
				columnValidationErrors.invalidPosition(mockedPosition, mockedId),
			),
		);
	});

	test(`Should return an error with code 'Column.PositionNegative' if the property position is a negative value`, () => {
		const mockedPosition = -1;
		const result = Column({
			name: "Random name",
			position: mockedPosition,
			boardId: "board-id",
			taskIds: [],
		});

		expect(result.errors[0]).toEqual(
			expect.objectContaining(
				columnValidationErrors.negativePosition(mockedPosition),
			),
		);
	});

	test(`Should return the same color added in the parameter if the property has a valid value`, () => {
		const mockedColor = "#11ffdd";
		const result = Column({
			id: "valid-id",
			name: "Random name",
			position: 12,
			boardId: "board-id",
			taskIds: [],
			color: mockedColor,
		});

		expect(result.value.color).toBe(mockedColor);
	});

	test(`Should return an error with code 'Column.ColorInvalid' if the property color is not a valid hex color`, () => {
		const mockedId = "some-id";
		const mockedColor = "invalid color";
		const result = Column({
			id: mockedId,
			name: "Random name",
			position: 12,
			boardId: "board-id",
			color: mockedColor,
			taskIds: [],
		});

		expect(result.errors[0]).toEqual(
			expect.objectContaining(
				columnValidationErrors.invalidColor(mockedColor, mockedId),
			),
		);
	});

	test(`Should generate a new color attribute if the parameter color is nullish`, () => {
		const result = Column({
			id: "valid-id",
			name: "Random name",
			position: 12,
			boardId: "board-id",
			taskIds: [],
			color: undefined,
		});

		expect(result.value.color).toBeTruthy();
	});

	test(`Should return an error with code 'Column.TaskIdsInvalid' if the property taskIds is not an array`, () => {
		const mockedId = "some-id";
		const result = Column({
			id: mockedId,
			name: "Random name",
			position: 12,
			boardId: "board-id",
			taskIds: undefined as unknown as string[],
		});

		expect(result.errors[0]).toEqual(
			expect.objectContaining(columnValidationErrors.invalidTaskIds(mockedId)),
		);
	});

	test(`Should generate a new Id if the property id is nullish`, () => {
		const result = Column({
			name: "Random name",
			position: 12,
			boardId: "board-id",
			taskIds: [],
		});

		expect(result.value.id).toBeTruthy();
	});

	test(`Should return the same Id added in the parameter if the property has a valid value`, () => {
		const mockedId = "valid-id";
		const result = Column({
			id: mockedId,
			name: "Random name",
			position: 12,
			boardId: "board-id",
			taskIds: [],
		});

		expect(result.value.id).toBe(mockedId);
	});
});
