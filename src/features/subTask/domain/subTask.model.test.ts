import { subTaskValidationErrors } from "./subTask.errors";
import { SubTask } from "./subTask.model";

describe("feature:SubTask --> SubtaskModel", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-02-06T08:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test("Should return an error 'SubTask.DescriptionEmpty' when description is empty", () => {
		const mockedId = "subtask-123";
		const result = SubTask({
			description: undefined as unknown as string,
			isCompleted: false,
			taskId: "task-123",
			id: mockedId,
		});

		expect(result.errors[0]).toEqual(
			subTaskValidationErrors.emptyDescription(mockedId),
		);
	});

	test("Should return an error 'SubTask.IsCompletedInvalid' when isCompleted is not a boolean", () => {
		const mockedId = "subtask-123";
		const result = SubTask({
			description: "Some description",
			isCompleted: "not a boolean" as unknown as boolean,
			taskId: "task-123",
			id: mockedId,
		});

		expect(result.errors[0]).toEqual(
			subTaskValidationErrors.invalidIsCompleted(mockedId),
		);
	});

	test("Should return an error 'SubTask.DescriptionTooLong' when description is too long", () => {
		const mockedId = "subtask-123";
		const longDescription = "a".repeat(501);
		const result = SubTask({
			description: longDescription,
			isCompleted: false,
			taskId: "task-123",
			id: mockedId,
		});

		expect(result.errors[0]).toEqual(
			subTaskValidationErrors.tooLongDescription(
				longDescription.length,
				mockedId,
			),
		);
	});

	test("Should return an error 'SubTask.TaskIdInvalid' when taskId is invalid", () => {
		const mockedId = "subtask-123";
		const invalidTaskId = undefined as unknown as string;
		const result = SubTask({
			description: "Some description",
			isCompleted: true,
			taskId: invalidTaskId,
			id: mockedId,
		});

		expect(result.errors[0]).toEqual(
			subTaskValidationErrors.invalidTaskId(invalidTaskId, mockedId),
		);
	});

	test("Should create a SubTaskModel successfully with valid input", () => {
		const validData = {
			description: "Valid description",
			isCompleted: false,
			taskId: "valid-task-id",
			id: "valid-id",
		};

		const result = SubTask(validData);

		expect(result.value).toEqual(validData);
		expect(result.errors).toHaveLength(0);
	});
});
