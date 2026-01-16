import { describe, expect, test } from "vitest";
import { taskValidationError } from "../task.errors";
import { Task, TASK_PRIORITIES } from "../task.model";

describe("feature:Task --> TaskModel", () => {
	test("Should return an error 'taskValidationError.emptyTitle' when title is empty", () => {
		const mockedTitle = undefined as unknown as string;
		const result = Task({
			title: mockedTitle,
			description: "Some description",
			isCompleted: false,
			position: 0,
			priority: TASK_PRIORITIES.LOW,
			columnId: "some-column-id",
			subtaskIds: [],
		});

		expect(result.errors[0].code).toBe(
			taskValidationError.emptyTitle("some id").code,
		);
	});

	test("Should return an error 'taskValidationError.tooLongTitle' when title is too long", () => {
		const mockedTitle = "a".repeat(201);
		const result = Task({
			title: mockedTitle,
			description: "Some description",
			isCompleted: false,
			position: 0,
			priority: TASK_PRIORITIES.LOW,
			columnId: "some-column-id",
			subtaskIds: [],
		});
		expect(result.errors[0].code).toBe(
			taskValidationError.tooLongTitle("some id").code,
		);
	});

	test("Should return an error 'taskValidationError.invalidPriority' when priority is invalid", () => {
		const mockedPriority =
			"urgent" as (typeof TASK_PRIORITIES)[keyof typeof TASK_PRIORITIES];
		const result = Task({
			title: "Some title",
			description: "Some description",
			isCompleted: false,
			position: 0,
			priority: mockedPriority,
			columnId: "some-column-id",
			subtaskIds: [],
		});
		expect(result.errors[0].code).toBe(
			taskValidationError.invalidPriority("some id", mockedPriority).code,
		);
	});

	test("Should return an error 'taskValidationError.invalidColumnId' when columnId is empty", () => {
		const result = Task({
			title: "Some title",
			description: "Some description",
			isCompleted: false,
			position: 0,
			priority: TASK_PRIORITIES.LOW,
			columnId: "",
			subtaskIds: [],
		});
		expect(result.errors[0].code).toBe(
			taskValidationError.invalidColumnId("some id").code,
		);
	});

	test("Should return an error 'taskValidationError.invalidPosition' when position is not a number", () => {
		const mockedPosition = undefined as unknown as number;
		const result = Task({
			title: "Some title",
			description: "Some description",
			isCompleted: false,
			position: mockedPosition,
			priority: TASK_PRIORITIES.LOW,
			columnId: "some-column-id",
			subtaskIds: [],
		});
		expect(result.errors[0].code).toBe(
			taskValidationError.invalidPosition("some id", mockedPosition).code,
		);
	});

	test("Should return an error 'taskValidationError.negativePosition' when position is negative", () => {
		const result = Task({
			title: "Some title",
			description: "Some description",
			isCompleted: false,
			position: -1,
			priority: TASK_PRIORITIES.LOW,
			columnId: "some-column-id",
			subtaskIds: [],
		});
		expect(result.errors[0].code).toBe(
			taskValidationError.negativePosition("some id", -1).code,
		);
	});

	test("Should return an error 'taskValidationError.invalidSubtaskIds' when subtaskIds is invalid", () => {
		const mockedSubtaskIds = undefined as unknown as string[];
		const result = Task({
			title: "Some title",
			description: "Some description",
			isCompleted: false,
			position: 10,
			priority: TASK_PRIORITIES.LOW,
			columnId: "some-column-id",
			subtaskIds: mockedSubtaskIds,
		});
		expect(result.errors[0].code).toBe(
			taskValidationError.invalidSubtaskIds("some id").code,
		);
	});

	test("Should create a TaskModel successfully when all data is valid", () => {
		const result = Task({
			id: "some-id",
			title: "Some title",
			description: "Some description",
			isCompleted: false,
			position: 0,
			priority: TASK_PRIORITIES.LOW,
			columnId: "Some column id",
			subtaskIds: [],
		});
		expect(result.value).toEqual({
			id: "some-id",
			title: "Some title",
			description: "Some description",
			isCompleted: false,
			position: 0,
			priority: TASK_PRIORITIES.LOW,
			columnId: "Some column id",
			subtaskIds: [],
		});
	});
});
