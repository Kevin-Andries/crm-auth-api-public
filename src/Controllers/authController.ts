import { Request, Response, NextFunction } from "express";
import axios from "axios";
// Utils
import catchError from "../Utils/catchError";
import {
	validateLoginForm,
	validateRegisterForm,
} from "../Utils/Validators/formValidators";
import AppError, { ErrorTypes } from "../Utils/appError";
import PgQuery, { Queries } from "../Utils/pg";
import { checkPassword, hashPassword } from "../Utils/bcrypt";
import isUser from "../Utils/Validators/isUser";
import signToken from "../Utils/signToken";
import cleanUserObject from "../Utils/cleanUserObject";

// Github auth
const clientId = process.env.GITHUB_CLIENT_ID as string;
const clientSecret = process.env.GITHUB_CLIENT_SECRET as string;

export const register = catchError(
	async (req: Request, res: Response, next: NextFunction) => {
		let { email, password, confirmPassword } = req.body;

		// Form validation
		if (!validateRegisterForm(email, password, confirmPassword)) {
			return next(new AppError(ErrorTypes.form));
		}

		// Hash password
		password = await hashPassword(password);

		// Create user
		let user = await PgQuery(Queries.register, [
			password,
			Date.now(),
			email,
		]);

		if (!user || !isUser(user)) {
			return next(new AppError(ErrorTypes.credentials));
		}

		const token = signToken(user.id);

		cleanUserObject(user);

		res.status(201).json({
			status: "success",
			token,
			user,
		});
	}
);

export const login = catchError(
	async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;

		if (!validateLoginForm(email, password)) {
			return next(new AppError(ErrorTypes.form));
		}

		const user = await PgQuery(Queries.getUserByEmail, [email]);

		if (!user || !isUser(user)) {
			return next(new AppError(ErrorTypes.credentials));
		}

		const isPasswordValid = await checkPassword(user.password!, password);

		if (!isPasswordValid) {
			return next(new AppError(ErrorTypes.credentials));
		}

		const token = signToken(user.id);

		cleanUserObject(user);

		res.status(200).json({
			message: "success",
			token,
			user,
		});
	}
);

export const loginWithGithub = catchError(
	async (_req: Request, res: Response) => {
		res.redirect(
			`https://github.com/login/oauth/authorize?client_id=${clientId}`
		);
	}
);

export const loginWithGithubCallback = catchError(
	async (req: Request, res: Response) => {
		const { code } = req.query;

		const body = {
			client_id: clientId,
			client_secret: clientSecret,
			code,
		};

		const authResponse = await axios.post(
			`https://github.com/login/oauth/access_token`,
			body,
			{
				headers: { accept: "application/json" },
			}
		);

		const githubToken = authResponse.data.access_token;

		const profile: any = (
			await axios.get("https://api.github.com/user", {
				headers: { Authorization: `Bearer ${githubToken}` },
			})
		).data;

		let user = await PgQuery(Queries.getUserById, [profile.id]);

		if (isUser(user)) {
			// Update user info with GitHub profile
			user = await PgQuery(Queries.updateUser, [profile.avatar_url]);
		} else {
			// Create user using GitHub profile
			user = await PgQuery(Queries.registerWithGithub, [
				profile.id,
				null,
				Date.now(),
				profile.email,
				profile.avatar_url,
				profile.login,
			]);
		}

		const token = signToken(profile.id);

		res.status(200).json({
			status: "success",
			token,
			user,
		});
	}
);
