import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Task, TASK_PRIORITIES, TaskModel } from "./task.model";
import { taskValidationErrors } from "./task.errors";

describe("feature:Task --> TaskModel", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-02-06T08:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test("Should return an error 'Task.TitleEmpty' when title is empty", () => {
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

		expect(result.errors[0]).toEqual(taskValidationErrors.emptyTitle());
	});

	test("Should return an error 'Task.TitleTooLong' when title is too long", () => {
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

		expect(result.errors[0]).toEqual(
			taskValidationErrors.tooLongTitle(mockedTitle.length),
		);
	});

	test("Should return an error 'Task.PriorityInvalid' when priority is invalid", () => {
		const mockedPriority = "urgent" as TaskModel["priority"];
		const result = Task({
			title: "Some title",
			description: "Some description",
			isCompleted: false,
			position: 0,
			priority: mockedPriority,
			columnId: "some-column-id",
			subtaskIds: [],
		});

		expect(result.errors[0]).toEqual(
			taskValidationErrors.invalidPriority(mockedPriority),
		);
	});

	test("Should return an error 'Task.ColumnIdInvalid' when columnId is empty", () => {
		const invalidColumnId = "";
		const result = Task({
			title: "Some title",
			description: "Some description",
			isCompleted: false,
			position: 0,
			priority: TASK_PRIORITIES.LOW,
			columnId: invalidColumnId,
			subtaskIds: [],
		});

		expect(result.errors[0]).toEqual(
			taskValidationErrors.invalidColumnId(invalidColumnId),
		);
	});

	test("Should return an error 'Task.PositionInvalid' when position is not a number", () => {
		const mockedPosition = "not-a-number" as unknown as number;
		const result = Task({
			title: "Some title",
			description: "Some description",
			isCompleted: false,
			position: mockedPosition,
			priority: TASK_PRIORITIES.LOW,
			columnId: "some-column-id",
			subtaskIds: [],
		});

		expect(result.errors[0]).toEqual(
			taskValidationErrors.invalidPosition(mockedPosition),
		);
	});

	test("Should return an error 'Task.PositionNegative' when position is negative", () => {
		const mockedPosition = -1;
		const result = Task({
			title: "Some title",
			description: "Some description",
			isCompleted: false,
			position: mockedPosition,
			priority: TASK_PRIORITIES.LOW,
			columnId: "some-column-id",
			subtaskIds: [],
		});

		expect(result.errors[0]).toEqual(
			taskValidationErrors.negativePosition(mockedPosition),
		);
	});

	test("Should return an error 'Task.SubtaskIdsInvalid' when subtaskIds is invalid", () => {
		const result = Task({
			title: "Some title",
			description: "Some description",
			isCompleted: false,
			position: 10,
			priority: TASK_PRIORITIES.LOW,
			columnId: "some-column-id",
			subtaskIds: undefined as unknown as [],
		});

		expect(result.errors[0]).toEqual(taskValidationErrors.invalidSubtaskIds());
	});

	test("Should create a TaskModel successfully when all data is valid", () => {
		const validData = {
			id: "some-id",
			title: "Some title",
			description: "Some description",
			isCompleted: false,
			position: 0,
			priority: TASK_PRIORITIES.LOW,
			columnId: "some-column-id",
			subtaskIds: [],
		};

		const result = Task(validData);

		expect(result.value).toEqual(validData);
		expect(result.errors).toHaveLength(0);
	});
});
