import { Request, Response, NextFunction } from "express";
// Utils
import catchError from "../Utils/catchError";
import PgQuery, { Queries } from "../Utils/pg";
import IUser from "../Utils/Interfaces/UserInterface";
import isUserArray from "../Utils/Validators/isUserArray";
import AppError, { ErrorTypes } from "../Utils/appError";
import cleanUserObject from "../Utils/cleanUserObject";
import isUser from "../Utils/Validators/isUser";

export const getAllUsers = catchError(
	async (req: Request, res: Response, next: NextFunction) => {
		const users = await PgQuery(Queries.getAllUsers);

		if (!isUserArray(users)) {
			return next(new AppError(ErrorTypes.noUsers));
		}

		users.forEach((user: IUser) => {
			cleanUserObject(user);
		});

		res.status(200).json({
			status: "success",
			length: users.length,
			users,
		});
	}
);

export const getUser = catchError(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		const user = await PgQuery(Queries.getUserById, [id]);

		if (!isUser(user)) {
			return next(new AppError(ErrorTypes.userNotFound));
		}

		res.status(200).json({
			status: "success",
			user,
		});
	}
);

export const deleteUser = catchError(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		const deleted = await PgQuery(Queries.deleteUser, [id]);

		if (!deleted) {
			return next(new AppError(ErrorTypes.userNotFound));
		}

		res.status(204).json({
			status: "success",
			message: `User ${id} has been deleted`,
		});
	}
);
