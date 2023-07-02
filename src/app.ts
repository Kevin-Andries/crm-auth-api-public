import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";

// Utils
import errorController from "./Utils/errorController";
import ping from "./Utils/ping";
// Routers
import authRouter from "./Routers/authRouter";
import usersRouter from "./Routers/usersRouter";

const app = express();

// Global middlewares
app.use(morgan("tiny"));
app.use(cors({ origin: process.env.CRM_API_URL }));
app.use(express.json());

// Auth router
app.use("/auth", authRouter);
app.use("/users", usersRouter);

// Ping
app.use("/ping", ping);

// Handles unhandled routes
app.all("*", (_req: Request, res: Response) => {
	res.status(404).json({
		status: "fail",
		message: "Route not found",
	});
});

app.use(errorController);

export default app;
