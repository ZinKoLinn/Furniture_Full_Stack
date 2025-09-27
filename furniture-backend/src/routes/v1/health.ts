import express from "express";

import { check } from "../../middlewares/check";
import { healthCheck } from "../../controllers/healthControllers";

const router = express.Router();

router.get("/health", check, healthCheck);

export default router;
