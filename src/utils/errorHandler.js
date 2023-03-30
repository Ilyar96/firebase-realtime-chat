import { notifyError } from "./notify";

const LOGIN_ERROR_MESSAGE = "Incorrect login or password";
const EXIST_EMAIL_ERROR_MESSAGE = "User with this email is already registered";
const DEFAULT_ERROR_MESSAGE = "Something went wrong...";

export const errorHandler = (error) => {
	const errorCode = error.code;

	switch (errorCode) {
		case "auth/wrong-password":
			notifyError(LOGIN_ERROR_MESSAGE);
			break;
		case "auth/user-not-found":
			notifyError(LOGIN_ERROR_MESSAGE);
			break;
		case "auth/email-already-in-use":
			notifyError(EXIST_EMAIL_ERROR_MESSAGE);
			break;
		default:
			notifyError(DEFAULT_ERROR_MESSAGE);
	}
};
