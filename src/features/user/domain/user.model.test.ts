import { userBusinessErrors, userValidationErrors } from "./user.errors";
import { User, UserModel } from "./user.model";

describe("-------> UserModel", () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-02-06T08:00:00Z"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test("Should return an error 'userValidationErrors.invalidSessionType' if the sessionType value is invalid", () => {
		const invalidSessionType =
			"INVALID_SESSION_TYPE" as UserModel["sessionType"];

		const userMock = User({
			id: "some-id",
			email: null,
			sessionType: invalidSessionType,
			theme: "Dark",
		});

		expect(userMock.errors[0]).toEqual(
			userValidationErrors.invalidSessionType(invalidSessionType),
		);
	});

	test("Should return an error 'userBusinessErrors.requiredIdForRegisteredUser' if the sessionType value is 'REGISTER' and the id value is nullable", () => {
		const userMock = User({
			id: undefined,
			email: null,
			sessionType: "BASE",
			theme: "Dark",
		});

		expect(userMock.errors[0]).toEqual(
			userBusinessErrors.requiredIdForRegisteredUser(),
		);
	});

	test("Should return an error 'userBusinessErrors.requiredEmailForBaseSession' if the sessionType value is 'REGISTER' and the email value is nullable", () => {
		const mockId = "a1b2c3d4-e5f6-7890-1234-567890abcdef";
		const userMock = User({
			id: mockId,
			email: null,
			sessionType: "BASE",
			theme: "Dark",
		});

		expect(userMock.errors[0]).toEqual(
			userBusinessErrors.requiredEmailForBaseSession(),
		);
	});

	test("Should return an error 'userValidationErrors.invalidTheme' if the theme value is invalid", () => {
		const mockedId = "a1b2c3d4-e5f6-7890-1234-567890abcdef";
		const mockedEmail = "mock.email@gmail.com";
		const mockedTheme = "INVALID_THEME" as UserModel["theme"];

		const userMock = User({
			id: mockedId,
			email: mockedEmail,
			sessionType: "BASE",
			theme: mockedTheme,
		});

		expect(userMock.errors[0]).toEqual(
			userValidationErrors.invalidTheme(mockedTheme),
		);
	});

	test("Should return a new id if the value was not defined and sessionType is 'DEMO' ", () => {
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
