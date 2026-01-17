import { describe, expect, test } from "vitest";
import { subTaskValidationError } from "../subTask.errors";
import { SubTask } from "../subTask.model";

describe("feature:SubTask --> SubtaskModel", () => {
	test("Should return an error with code 'subTaskValidationError.emptyDescription' when description is empty", () => {
		const mockedDescription = undefined as unknown as string;
		const result = SubTask({
			description: mockedDescription,
			isCompleted: false,
			taskId: "some taskId",
			id: "some id",
		});

		expect(result.errors[0].code).toBe(
			subTaskValidationError.emptyDescription("some id").code,
		);
	});

	test("Should return an error with code 'subTaskValidationError.invalidIsCompleted' when isCompleted is not a boolean", () => {
		const mockedIsCompleted = "not a boolean" as unknown as boolean;
		const result = SubTask({
			description: "Some description",
			isCompleted: mockedIsCompleted,
			taskId: "some taskId",
			id: "some id",
		});

		expect(result.errors[0].code).toBe(
			subTaskValidationError.invalidIsCompleted("some id").code,
		);
	});

	test("Should return an error with code 'subTaskValidationError.tooLongDescription' when description is too long", () => {
		const mockedDescription = "a".repeat(501);
		const result = SubTask({
			description: mockedDescription,
			isCompleted: false,
			taskId: "some taskId",
			id: "some id",
		});

		expect(result.errors[0].code).toBe(
			subTaskValidationError.tooLongDescription("some id").code,
		);
	});

	test("Should return an error with code 'subTaskValidationError.invalidIsCompleted' when isCompleted is not a boolean", () => {
		const mockedIsCompleted = "not a boolean" as unknown as boolean;
		const result = SubTask({
			description: "Some description",
			isCompleted: mockedIsCompleted,
			taskId: "some taskId",
			id: "some id",
		});

		expect(result.errors[0].code).toBe(
			subTaskValidationError.invalidIsCompleted("some id").code,
		);
	});

	test("Should return an error with code 'subTaskValidationError.invalidTaskId' when taskId is empty", () => {
		const mockedTaskId = undefined as unknown as string;
		const result = SubTask({
			description: "Some description",
			isCompleted: true,
			taskId: mockedTaskId,
			id: "some id",
		});

		expect(result.errors[0].code).toBe(
			subTaskValidationError.invalidTaskId("some id").code,
		);
	});

	test("Should create a SubTaskModel successfully with valid input", () => {
		const result = SubTask({
			description: "Valid description",
			isCompleted: false,
			taskId: "validTaskId",
			id: "validId",
		});
		expect(result.value).toEqual({
			description: "Valid description",
			isCompleted: false,
			taskId: "validTaskId",
			id: "validId",
		});
	});
});
