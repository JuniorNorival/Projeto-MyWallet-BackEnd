import express from "express";
import * as recordscontrollers from "../controllers/records.controller.js";
import { authValidation } from "../middlewares/auth.middleware.js";
import { recordValidation } from "../middlewares/recordsValidation.middlewares.js";

const router = express.Router();

router.get("/wallet", authValidation, recordscontrollers.get);
router.post(
  "/wallet",
  recordValidation,
  authValidation,
  recordscontrollers.create
);
router.delete(
  "/wallet/:idRecord",
  authValidation,
  recordscontrollers.deleteRecord
);

export default router;
