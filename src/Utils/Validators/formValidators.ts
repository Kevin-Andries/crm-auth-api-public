import isEmail from "validator/lib/isEmail";
import { PASSWORD_LENGTH } from "./fields";

const isEmailValid = (email: string) => email && isEmail(email);
const isPasswordValid = (password: string) =>
	password && password.length >= PASSWORD_LENGTH;

export const validateRegisterForm = (
	email: string,
	password: string,
	confirmPassword: string
) => {
	return (
		isEmailValid(email) &&
		isPasswordValid(password) &&
		password === confirmPassword
	);
};

export const validateLoginForm = (email: string, password: string) => {
	return isEmailValid(email) && isPasswordValid(password);
};
