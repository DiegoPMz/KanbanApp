import { boardValidationErrors } from "./board.errors";
import { Board } from "./board.model";

describe("feature:Board --> BoardModel", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-02-06T08:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test(`Should return the domain error 'boardValidationErrors.emptyName' when the Board name is null or undefined`, () => {
		const mockedName = undefined as unknown as string;

		const mockBoard = Board({ name: mockedName, id: undefined, columnIds: [] });

		expect(mockBoard.errors[0]).toEqual(boardValidationErrors.emptyName());
	});

	test(`Should return the domain error 'boardValidationErrors.tooLongName' when the Board name is too long`, () => {
		const mockedName = "a".repeat(101);

		const mockBoard = Board({ name: mockedName, id: undefined, columnIds: [] });

		expect(mockBoard.errors[0]).toEqual(
			boardValidationErrors.tooLongName(mockedName.length),
		);
	});

	test("Should assign a new, truthy 'id' to the Board if the 'id' property provided is null or undefined", () => {
		const mockBoard = Board({
			name: "Test name",
			id: undefined,
			columnIds: [],
		});

		expect(mockBoard.value.id).toBeTruthy();
	});

	test("Should preserve and use the 'id' provided in the parameters if it is a valid (non-null) value", () => {
		const mockedId = "some random Id";
		const mockBoard = Board({ name: "Test name", id: mockedId, columnIds: [] });

		expect(mockBoard.value.id).toBe(mockedId);
	});

	test(`Should return the domain error 'boardValidationErrors.invalidColumnIds' when the Board columns property is not an array`, () => {
		const mockedColumns = undefined as unknown as [];
		const mockedId = "Some Id";

		const mockBoard = Board({
			name: "Some name",
			id: mockedId,
			columnIds: mockedColumns,
		});

		expect(mockBoard.errors[0]).toEqual(
			boardValidationErrors.invalidColumnIds(mockedId),
		);
	});
});
