import express from "express";

import { auth } from "../../middlewares/auth";
import { authorise } from "../../middlewares/authorise";
import health from "../../routes/v1/health";
import authRoute from "./auth";
import adminRoutes from "./admin/index";
import userRoutes from "./api";
import { maintenance } from "../../middlewares/maintenance";

const router = express.Router();

router.use(health);

router.use("/api/v1", maintenance, authRoute);
router.use("/api/v1/users", maintenance, userRoutes);
router.use(
  "/api/v1/admins",
  maintenance,
  auth,
  authorise(true, "ADMIN"),
  adminRoutes
);

export default router;
