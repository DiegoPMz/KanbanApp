import { Result } from "@/shared/lib/result";
import { describe, expect, test } from "vitest";
import { Board } from "../board.domain";
import { boardColumnsErrors, boardNameErrors } from "../board.errors";

describe("feature:Board --> BoardModel", () => {
	test("Should return an instance of 'Result' when attempting to create a Board (whether valid or invalid)", () => {
		const mockBoard = Board({ id: undefined, name: "someName", columns: [] });
		expect(mockBoard).instanceOf(Result);
	});

	test(`Should return the domain error code '${boardNameErrors.code}' when the Board name is null or undefined`, () => {
		const mockedId = undefined;
		const mockedName = undefined as unknown as string;

		const mockBoard = Board({ name: mockedName, id: mockedId, columns: [] });

		expect(mockBoard.errors[0]?.code).toBe(boardNameErrors.code);
	});

	test("Should assign a new, truthy 'id' to the Board if the 'id' property provided is null or undefined", () => {
		const mockedId = undefined;
		const mockBoard = Board({ name: "Test name", id: mockedId, columns: [] });

		expect(mockBoard.value.id).toBeTruthy();
	});

	test("Should preserve and use the 'id' provided in the parameters if it is a valid (non-null) value", () => {
		const mockedId = "some random Id";
		const mockBoard = Board({ name: "Test name", id: mockedId, columns: [] });

		expect(mockBoard.value.id).toBe(mockedId);
	});

	test(`Should return the domain error code ${boardColumnsErrors.code} when the Board columns property is not an array`, () => {
		const mockedColumns = undefined as unknown as [];
		const mockBoard = Board({
			name: "Some name",
			id: "Some Id",
			columns: mockedColumns,
		});

		expect(mockBoard.errors[0]?.code).toBe(boardColumnsErrors.code);
	});
});
