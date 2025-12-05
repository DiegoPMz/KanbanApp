export const userThemeErrors = {
	code: "USER_THEME_INVALID",
	messages: {
		invalid:
			"Theme must be a non-empty string and one of the predefined themes.",
		empty: "Theme cannot be empty.",
	},
};

export const userSessionTypeErrors = {
	code: "USER_SESSION_TYPE_INVALID",
	messages: {
		invalid: "Session type must be one of the predefined session types.",
		registeredWithoutId: "Registered session must have a user ID.",
	},
};

export const userEmailErrors = {
	code: "USER_EMAIL_INVALID",
	messages: {
		registeredWithoutEmail: "Email is required for registered users.",
	},
};

export const userIdErrors = {
	code: "USER_ID_INVALID",
	messages: {
		registeredWithoutId: "User ID is required for registered users.",
	},
};
