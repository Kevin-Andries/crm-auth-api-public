import IUser from "../Interfaces/UserInterface";

export default function (user: any): user is IUser {
	return (user as IUser).id !== undefined;
}
