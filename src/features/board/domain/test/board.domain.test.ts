import { Result } from "@/shared/domain/result";
import { describe, expect, test } from "vitest";

import { boardValidationErrors } from "../board.errors";
import { Board } from "../board.model";

describe("feature:Board --> BoardModel", () => {
	test("Should return an instance of 'Result' when attempting to create a Board (whether valid or invalid)", () => {
		const mockBoard = Board({ id: undefined, name: "someName", columnIds: [] });
		expect(mockBoard).instanceOf(Result);
	});

	test(`Should return the domain error 'boardValidationErrors.emptyName' when the Board name is null or undefined`, () => {
		const mockedId = undefined;
		const mockedName = undefined as unknown as string;

		const mockBoard = Board({ name: mockedName, id: mockedId, columnIds: [] });

		expect(mockBoard.errors[0].code).toBe(
			boardValidationErrors.emptyName(mockedId ?? "undefined").code,
		);
	});

	test(`Should return the domain error 'boardValidationErrors.tooLongName' when the Board name is too long`, () => {
		const mockedId = undefined;
		const mockedName = "a".repeat(101);

		const mockBoard = Board({ name: mockedName, id: mockedId, columnIds: [] });

		expect(mockBoard.errors[0].code).toBe(
			boardValidationErrors.tooLongName(mockedId ?? "undefined").code,
		);
	});

	test("Should assign a new, truthy 'id' to the Board if the 'id' property provided is null or undefined", () => {
		const mockedId = undefined;
		const mockBoard = Board({ name: "Test name", id: mockedId, columnIds: [] });

		expect(mockBoard.value.id).toBeTruthy();
	});

	test("Should preserve and use the 'id' provided in the parameters if it is a valid (non-null) value", () => {
		const mockedId = "some random Id";
		const mockBoard = Board({ name: "Test name", id: mockedId, columnIds: [] });

		expect(mockBoard.value.id).toBe(mockedId);
	});

	test(`Should return the domain error 'boardValidationErrors.invalidColumnIds' when the Board columns property is not an array`, () => {
		const mockedColumns = undefined as unknown as [];
		const mockBoard = Board({
			name: "Some name",
			id: "Some Id",
			columnIds: mockedColumns,
		});

		expect(mockBoard.errors[0].code).toBe(
			boardValidationErrors.invalidColumnIds("Some Id").code,
		);
	});
});
