import { Result, ResultError } from "./result";

describe("shared/domain/Result.ts", () => {
	describe("Success cases", () => {
		test("should encapsulate and return the provided value", () => {
			const mockedValue = { id: 12345, type: "Test" };
			const result = Result.Success(mockedValue);

			expect(result.value).toStrictEqual(mockedValue);
			expect(result.isSuccess).toBe(true);
		});

		test("should have an empty error list when successful", () => {
			const result = Result.Success({ id: 1 });
			expect(result.errors).toEqual([]);
		});
	});

	describe("Failure cases", () => {
		test("should indicate failure and return null as value", () => {
			const mockErrors: ResultError[] = [
				{
					code: "Test.Error",
					message: "Error message",
					type: "Validation",
				},
			];
			const result = Result.Failure(mockErrors);

			expect(result.isSuccess).toBe(false);
			expect(result.value).toBeNull();
		});

		test("should log a warning when created with an empty error array", () => {
			const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
			const result = Result.Failure([]);

			expect(result.isSuccess).toBe(false);
			expect(result.errors).toHaveLength(0);

			expect(warnSpy).toHaveBeenCalledWith(
				"Warning: Result.Failure created with no errors.",
			);

			warnSpy.mockRestore();
		});

		test("should maintain the list of provided errors", () => {
			const mockErrors: ResultError[] = [
				{
					code: "Test.Error",
					message: "Error message",
					type: "Validation",
				},
			];
			const result = Result.Failure(mockErrors);

			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].code).toBe("Test.Error");
		});

		test("should preserve error metadata if provided", () => {
			const errorWithMetadata: ResultError = {
				code: "AUTH_001",
				message: "Session expired",
				type: "Authentication",
				metadata: { expiredAt: "2026-02-05" },
			};

			const result = Result.Failure([errorWithMetadata]);

			expect(result.errors[0].metadata).toEqual({ expiredAt: "2026-02-05" });
		});

		test("should store and return multiple errors in the same order", () => {
			const mockErrors: ResultError[] = [
				{ code: "E1", message: "Error 1", type: "Validation" },
				{ code: "E2", message: "Error 2", type: "Conflict" },
			];

			const result = Result.Failure(mockErrors);

			expect(result.errors).toHaveLength(2);
			expect(result.errors[0].code).toBe("E1");
			expect(result.errors[1].code).toBe("E2");
		});
	});
});
