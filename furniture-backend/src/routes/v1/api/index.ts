import express from "express";

import {
  changeLanguage,
  testPermission,
  uploadProfile,
  getMyPhoto,
  uploadMultiple,
  uploadProfileOptimize,
} from "../../../controllers/api/profileController";
import { auth } from "../../../middlewares/auth";
import uploadFiles from "../../../middlewares/uploadFiles";
import {
  getPost,
  getPostsByPagination,
} from "../../../controllers/api/postController";

const router = express.Router();

router.post("/change-language", changeLanguage);
router.get("/test-permission", testPermission);

router.patch(
  "/profile/upload",
  auth,
  uploadFiles.single("avatar"),
  uploadProfile
);
router.patch(
  "/profile/upload/multiple",
  auth,
  uploadFiles.array("avatar"),
  uploadMultiple
);

router.patch(
  "/profile/upload/optimize",
  auth,
  uploadFiles.single("avatar"),
  uploadProfileOptimize
);

router.get("/profile/my-photo", getMyPhoto); //Just for Testing

router.get("/posts", auth, getPostsByPagination);
router.get("/posts/:id", auth, getPost);

export default router;
