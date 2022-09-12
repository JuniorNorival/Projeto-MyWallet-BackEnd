import express from "express";
import * as userscontrollers from "../controllers/users.controller.js";
import {
  userValidate,
  newUserValidate,
} from "../middlewares/userValidation.middlewares.js";

const router = express.Router();
router.post("/login", userValidate, userscontrollers.login);
router.post("/sign-up", newUserValidate, userscontrollers.create);

export default router;
