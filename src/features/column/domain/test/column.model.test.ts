import { describe, expect, test } from "vitest";
import {
	columnBoardIdErrors,
	columnNameErrors,
	columnPositionErrors,
} from "../column.errors";
import { Column } from "../column.model";

describe("feature:Column --> ColumnModel", () => {
	test(`Should return an error with code '${columnNameErrors.code}' if the column have a nullish name`, () => {
		const mockedName = undefined as unknown as string;
		const result = Column({
			name: mockedName,
			position: 0,
			boardId: "some boardId",
			tasks: [],
		});

		expect(result.errors[0].code).toBe(columnNameErrors.code);
	});

	test(`Should return an error with code '${columnBoardIdErrors.code}' if the property boardId is nullish`, () => {
		const mockedBoardId = undefined as unknown as string;
		const result = Column({
			name: "Random name",
			position: 0,
			boardId: mockedBoardId,
			tasks: [],
		});

		expect(result.errors[0].code).toBe(columnBoardIdErrors.code);
	});

	test(`Should return an error with code '${columnPositionErrors.code}' if the property position is a negative value`, () => {
		const result = Column({
			name: "Random name",
			position: -1,
			boardId: "boardId",
			tasks: [],
		});

		expect(result.errors[0].code).toBe(columnPositionErrors.code);
	});

	test(`Should generate a new Id if the property id is nullish`, () => {
		const result = Column({
			name: "Random name",
			position: 12,
			boardId: "boardId",
			tasks: [],
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
			tasks: [],
		});

		expect(result.value.id).toBe(mockedId);
	});

	test(`Should generate a new color attribute if the parameter color is nullish`, () => {
		const result = Column({
			id: "valid id",
			name: "Random name",
			position: 12,
			boardId: "boardId",
			tasks: [],
			color: undefined,
		});

		expect(result.value.color).toBeTruthy();
	});

	test(`Should return the same color added in the parameter if the property has a valid value`, () => {
		const mockedColor = "#11ffdd";
		const result = Column({
			id: "valid id",
			name: "Random name",
			position: 12,
			boardId: "boardId",
			tasks: [],
			color: mockedColor,
		});

		expect(result.value.color).toBe(mockedColor);
	});
});
