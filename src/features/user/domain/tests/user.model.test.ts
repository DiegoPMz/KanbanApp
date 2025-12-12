import { describe, expect, test } from "vitest";
import {
	userEmailErrors,
	userSessionTypeErrors,
	userThemeErrors,
} from "../user.errors";
import { User, UserModel } from "../user.model";
import { userIdErrors } from "./../user.errors";

describe("-------> UserModel", () => {
	test(`Should return an error with code ${userSessionTypeErrors.code} if the sessionType value is invalid`, () => {
		const invalidSessionType =
			"INVALID_SESSION_TYPE" as UserModel["sessionType"];
		const userMock = User({
			id: undefined,
			email: null,
			sessionType: invalidSessionType,
			theme: "Dark",
		});

		expect(userMock.errors[0].code).toBe(userSessionTypeErrors.code);
	});

	test(`Should return an error with code ${userIdErrors.code} if the sessionType value is 'REGISTER' and the id value is nullable`, () => {
		const userMock = User({
			id: undefined,
			email: null,
			sessionType: "REGISTER",
			theme: "Dark",
		});

		expect(userMock.errors[0].code).toBe(userIdErrors.code);
	});

	test(`Should return an error with code ${userEmailErrors.code} if the sessionType value is 'REGISTER' and the email value is nullable`, () => {
		const MOCKED_UUID = "a1b2c3d4-e5f6-7890-1234-567890abcdef";
		const userMock = User({
			id: MOCKED_UUID,
			email: null,
			sessionType: "REGISTER",
			theme: "Dark",
		});

		expect(userMock.errors[0].code).toBe(userEmailErrors.code);
	});

	test(`Should return an error with code ${userThemeErrors.code} if the theme value is invalid`, () => {
		const MOCKED_UUID = "a1b2c3d4-e5f6-7890-1234-567890abcdef";
		const MOCKED_EMAIL = "mock.email@gmail.com";
		const MOCK_THEME = "INVALID_THEME" as UserModel["theme"];

		const userMock = User({
			id: MOCKED_UUID,
			email: MOCKED_EMAIL,
			sessionType: "REGISTER",
			theme: MOCK_THEME,
		});

		expect(userMock.errors[0].code).toBe(userThemeErrors.code);
	});

	test(`Should return a new id if its value was not defined and sessionType is 'DEMO' `, () => {
		const MOCKED_EMAIL = "mock.email@gmail.com";

		const userMock = User({
			id: undefined,
			email: MOCKED_EMAIL,
			sessionType: "DEMO",
			theme: "Dark",
		});

		expect(userMock.value.id).toBeDefined();
	});

	test(`Should set the email attribute value to null if sessionType is 'DEMO' `, () => {
		const MOCKED_UUID = "a1b2c3d4-e5f6-7890-1234-567890abcdef";
		const MOCKED_EMAIL = "mock.email@gmail.com";

		const userMock = User({
			id: MOCKED_UUID,
			email: MOCKED_EMAIL,
			sessionType: "DEMO",
			theme: "Dark",
		});

		expect(userMock.value.email).toBeNull();
	});
});
