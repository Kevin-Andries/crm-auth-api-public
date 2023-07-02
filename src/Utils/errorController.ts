import { Request, Response, NextFunction } from "express";

export default function (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	//console.log(err);

	res.status(err.status || 500).json({
		status: "error",
		from: "auth_api",
		message: err.message,
	});
}
