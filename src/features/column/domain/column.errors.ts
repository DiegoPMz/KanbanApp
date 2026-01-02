export const columnNameErrors = {
	code: "COLUMN_NAME_INVALID",
	messages: {
		empty: "Column name cannot be empty.",
		tooLong: "Column name cannot exceed 200 characters.",
	},
};

export const columnIdErrors = {
	code: "COLUMN_ID_ERROR",
	messages: {
		alreadyExists: "The column id already exists.",
	},
};

export const columnBoardIdErrors = {
	code: "COLUMN_BOARD_ID_INVALID",
	messages: {
		invalid: "The column must belong to a valid board.",
		empty: "The column board ID cannot be empty.",
	},
};

export const columnPositionErrors = {
	code: "COLUMN_POSITION_INVALID",
	messages: {
		negative: "The column position cannot be negative.",
	},
};
