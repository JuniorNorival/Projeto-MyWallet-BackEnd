import express from "express";
import * as userscontrollers from "../controllers/users.controller.js";

const router = express.Router();
router.post("/login", userscontrollers.login);
router.post("/singup", userscontrollers.create);

export default router;
