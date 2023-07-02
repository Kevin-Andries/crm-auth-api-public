import express from "express";
import * as authController from "../Controllers/authController";

const router = express.Router();

// Auth routes
router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/login/github").get(authController.loginWithGithub);
router
	.route("/login/github/callback")
	.get(authController.loginWithGithubCallback);

export default router;
