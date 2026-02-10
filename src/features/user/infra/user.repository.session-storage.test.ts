import { errorTypes } from "@/shared/domain/result";
import { sessionDb } from "@/shared/infra/persistence/session-storage.db";
import { userErrorCodes } from "../domain/user.errors";
import { UserModel } from "../domain/user.model";
import { sessionStorageUserRepository } from "./user.repository.session-storage";
import { globalErrors } from "@/shared/domain/errors/global.error";

const createDemoUser = (overrides?: Partial<UserModel>): UserModel => ({
	id: "random-mock-id",
	email: null,
	sessionType: "DEMO",
	theme: "Dark",
	...overrides,
});

describe("features/user : sessionStorageUserRepository", () => {
	beforeEach(() => {
		sessionStorage.clear();
	});

	describe("getDetails()", () => {
		test(`should fail with '${errorTypes.Authentication}' when no user session exists`, async () => {
			const result = await sessionStorageUserRepository.getDetails();

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0].type).toBe(errorTypes.Authentication);
		});

		test(`should successfully retrieve 'Demo User' data when state is valid`, async () => {
			const mockedDemoUser = createDemoUser();
			sessionDb.user.save(mockedDemoUser);

			const result = await sessionStorageUserRepository.getDetails();

			expect(result.isSuccess).toBe(true);
			expect(result.value).toEqual(mockedDemoUser);
		});

		test(`should fail with '${userErrorCodes.StorageCorrupted}' when persisted data violates domain rules`, async () => {
			const corruptedUser = createDemoUser({
				email: "invalid@gmail.com",
				sessionType: "BASE",
			});
			sessionDb.user.save(corruptedUser);

			const result = await sessionStorageUserRepository.getDetails();

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0].code).toBe(userErrorCodes.StorageCorrupted);
		});
	});

	describe("update()", () => {
		test(`should return an authentication error when attempting to update a non-existent session`, async () => {
			const anyUser = createDemoUser();

			const result = await sessionStorageUserRepository.update(anyUser);

			expect(result.isSuccess).toBe(false);
			expect(result.errors[0]).toEqual(globalErrors.authentication());
		});

		test(`should only persist allowed fields, ignoring restricted properties (id, sessionType, email)`, async () => {
			const originalUser = createDemoUser({ theme: "Dark" });
			sessionDb.user.save(originalUser);

			const updatePayload: UserModel = {
				...originalUser,
				theme: "Light", // Allowed
				email: "hacker@gmail.com", // Restricted
				sessionType: "BASE", // Restricted
			};

			const result = await sessionStorageUserRepository.update(updatePayload);

			expect(result.value).toEqual({
				...originalUser,
				theme: "Light",
			});

			const persisted = sessionDb.user.get();
			expect(persisted).toEqual({
				...originalUser,
				theme: "Light",
			});
		});
	});
});
