import { NextFunction, Request, Response } from "express";

export default function ping(req: Request, res: Response, next: NextFunction) {
	res.status(200).end();
}
