export default class AppError extends Error {
	status: number;

	constructor(error?: undefined | IError) {
		super(error?.message || "Something went wrong");
		this.status = error?.status || 500;
	}
}

interface IError {
	message: string;
	status: number;
}

interface IErrorTypes {
	[key: string]: IError;
}

export const ErrorTypes: IErrorTypes = {
	form: {
		message: "Invalid form",
		status: 400,
	},
	credentials: {
		message: "Invalid credentials",
		status: 401,
	},
	userNotFound: {
		message: "User not found",
		status: 404,
	},
	noUsers: {
		message: "No users found",
		status: 404,
	},
	unauthorized: {
		message: "Unauthorized",
		status: 401,
	},
};
