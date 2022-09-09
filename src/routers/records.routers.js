import express from "express";
import * as recordscontrollers from "../controllers/records.controller.js";

const router = express.Router();
router.get("/wallet", recordscontrollers.get);
router.post("/wallet", recordscontrollers.create);

export default router;
