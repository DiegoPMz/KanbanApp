import { describe, expect, test } from "vitest";
import { columnValidationErrors } from "../column.errors";
import { Column } from "../column.model";

describe("feature:Column --> ColumnModel", () => {
	test(`Should return an error with code 'columnValidationErrors.emptyName' if the column have a nullish name`, () => {
		const mockedName = undefined as unknown as string;
		const result = Column({
			name: mockedName,
			position: 0,
			boardId: "some boardId",
			taskIds: [],
		});

		expect(result.errors[0].code).toBe(
			columnValidationErrors.emptyName("some id").code,
		);
	});

	test(`Should return an error with code 'columnValidationErrors.invalidBoardId' if the property boardId is nullish`, () => {
		const mockedBoardId = undefined as unknown as string;
		const result = Column({
			name: "Random name",
			position: 0,
			boardId: mockedBoardId,
			taskIds: [],
		});

		expect(result.errors[0].code).toBe(
			columnValidationErrors.invalidBoardId("some id", mockedBoardId).code,
		);
	});

	test(`Should return an error with code 'columnValidationErrors.invalidPosition' if the property is not a number`, () => {
		const mockedPosition = "invalid position" as unknown as number;
		const result = Column({
			id: "some id",
			name: "Random name",
			position: mockedPosition,
			boardId: "boardId",
			taskIds: [],
		});

		expect(result.errors[0].code).toBe(
			columnValidationErrors.invalidPosition("some id", mockedPosition).code,
		);
	});

	test(`Should return an error with code 'columnValidationErrors.negativePosition' if the property position is a negative value`, () => {
		const result = Column({
			name: "Random name",
			position: -1,
			boardId: "boardId",
			taskIds: [],
		});

		expect(result.errors[0].code).toBe(
			columnValidationErrors.negativePosition("some id", -1).code,
		);
	});

	test(`Should return the same color added in the parameter if the property has a valid value`, () => {
		const mockedColor = "#11ffdd";
		const result = Column({
			id: "valid id",
			name: "Random name",
			position: 12,
			boardId: "boardId",
			taskIds: [],
			color: mockedColor,
		});

		expect(result.value.color).toBe(mockedColor);
	});

	test(`Should return an error with code 'columnValidationErrors.invalidColor' if the property color is not a valid hex color`, () => {
		const mockedColor = "invalid color";
		const result = Column({
			id: "some id",
			name: "Random name",
			position: 12,
			boardId: "boardId",
			color: mockedColor,
			taskIds: [],
		});

		expect(result.errors[0].code).toBe(
			columnValidationErrors.invalidColor("some id", mockedColor).code,
		);
	});

	test(`Should generate a new color attribute if the parameter color is nullish`, () => {
		const result = Column({
			id: "valid id",
			name: "Random name",
			position: 12,
			boardId: "boardId",
			taskIds: [],
			color: undefined,
		});

		expect(result.value.color).toBeTruthy();
	});

	test(`Should return an error with code 'columnValidationErrors.invalidTaskIds' if the property taskIds is not an array`, () => {
		const mockedTaskIds = undefined as unknown as string[];
		const result = Column({
			id: "some id",
			name: "Random name",
			position: 12,
			boardId: "boardId",
			taskIds: mockedTaskIds,
		});

		expect(result.errors[0].code).toBe(
			columnValidationErrors.invalidTaskIds("some id").code,
		);
	});

	test(`Should generate a new Id if the property id is nullish`, () => {
		const result = Column({
			name: "Random name",
			position: 12,
			boardId: "boardId",
			taskIds: [],
		});

		expect(result.value.id).toBeTruthy();
	});

	test(`Should return the same Id added in the parameter if the property has a valid value`, () => {
		const mockedId = "valid id";
		const result = Column({
			id: mockedId,
			name: "Random name",
			position: 12,
			boardId: "boardId",
			taskIds: [],
		});

		expect(result.value.id).toBe(mockedId);
	});
});
