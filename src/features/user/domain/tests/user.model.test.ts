import { describe, expect, test } from "vitest";
import { userValidationErrors } from "../user.errors";
import { User, UserModel } from "../user.model";

describe("-------> UserModel", () => {
	test(`Should return an error with code 'invalidSessionType.code' if the sessionType value is invalid`, () => {
		const invalidSessionType =
			"INVALID_SESSION_TYPE" as UserModel["sessionType"];

		const userMock = User({
			id: "some-id",
			email: null,
			sessionType: invalidSessionType,
			theme: "Dark",
		});

		expect(userMock.errors[0].code).toBe(
			userValidationErrors.invalidSessionType("some-id", invalidSessionType)
				.code,
		);
	});

	test(`Should return an error with code 'requiredIdForRegisteredUser.code' if the sessionType value is 'REGISTER' and the id value is nullable`, () => {
		const userMock = User({
			id: undefined,
			email: null,
			sessionType: "REGISTER",
			theme: "Dark",
		});

		expect(userMock.errors[0].code).toBe(
			userValidationErrors.requiredIdForRegisteredUser("REGISTER").code,
		);
	});

	test(`Should return an error with code 'invalidEmailForRegisteredUser.code' if the sessionType value is 'REGISTER' and the email value is nullable`, () => {
		const mockId = "a1b2c3d4-e5f6-7890-1234-567890abcdef";
		const userMock = User({
			id: mockId,
			email: null,
			sessionType: "REGISTER",
			theme: "Dark",
		});

		expect(userMock.errors[0].code).toBe(
			userValidationErrors.invalidEmailForRegisteredUser(mockId).code,
		);
	});

	test(`Should return an error with code 'invalidTheme.code' if the theme value is invalid`, () => {
		const mockedId = "a1b2c3d4-e5f6-7890-1234-567890abcdef";
		const mockedEmail = "mock.email@gmail.com";
		const mockedTheme = "INVALID_THEME" as UserModel["theme"];

		const userMock = User({
			id: mockedId,
			email: mockedEmail,
			sessionType: "REGISTER",
			theme: mockedTheme,
		});

		expect(userMock.errors[0].code).toBe(
			userValidationErrors.invalidTheme(mockedId, mockedTheme).code,
		);
	});

	test(`Should return a new id if its value was not defined and sessionType is 'DEMO' `, () => {
		const mockedEmail = "mock.email@gmail.com";

		const userMock = User({
			id: undefined,
			email: mockedEmail,
			sessionType: "DEMO",
			theme: "Dark",
		});

		expect(userMock.value.id).toBeDefined();
	});
});
