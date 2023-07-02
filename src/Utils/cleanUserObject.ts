import IUser from "./Interfaces/UserInterface";

/**
 * Removes all sensitive fields from a user object (password, etc)
 * @param user A user object
 */
const sensitiveFields = ["password"];

export default function (user: IUser, whiteList?: string[]) {
	Object.keys(user).forEach((field: string) => {
		if (
			sensitiveFields.includes(field) &&
			(!whiteList || !whiteList.includes(field))
		) {
			delete user[field as keyof IUser];
		}
	});
}
