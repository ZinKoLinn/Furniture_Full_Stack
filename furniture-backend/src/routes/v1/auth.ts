import express from "express";

import {
  register,
  verifyOtp,
  confirmPassword,
  login,
  logout,
  forgetPassword,
  verifyOtpforPassword,
  resetPassword,
  authCheck,
  changePassword,
  confirmChangePassword,
  deleteCat,
  deleteType,
} from "../../controllers/authControllers";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/confirm-password", confirmPassword);
router.post("/login", login);
router.post("/logout", logout);

router.post("/forget-password", forgetPassword);
router.post("/verify", verifyOtpforPassword);
router.post("/reset-password", resetPassword);

router.get("/auth-check", auth, authCheck);

router.post("/change-password", changePassword);
router.post("/confirm-change", confirmChangePassword);

router.post("/deleteCat", deleteCat);
router.post("/deleteType", deleteType);

export default router;
