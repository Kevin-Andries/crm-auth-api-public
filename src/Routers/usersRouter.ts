import express from "express";
import * as usersController from "../Controllers/usersController";

const router = express.Router();

router.route("/").get(usersController.getAllUsers);
router.route("/:id").get(usersController.getUser);
router.route("/:id").delete(usersController.deleteUser);

export default router;
