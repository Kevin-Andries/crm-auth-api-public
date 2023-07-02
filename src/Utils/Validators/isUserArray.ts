import IUser from "../Interfaces/UserInterface";

export default function (users: any): users is IUser[] {
	return users && (users as IUser[]).length !== undefined;
}
