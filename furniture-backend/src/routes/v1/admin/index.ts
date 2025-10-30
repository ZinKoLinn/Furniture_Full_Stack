import express from "express";

import { getAllUsers } from "../../../controllers/admin/userControllers";
import { setMaintenance } from "../../../controllers/admin/systemController";
import upload from "../../../middlewares/uploadFiles";
import {
  createPost,
  deletePost,
  updatePost,
} from "../../../controllers/admin/postController";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../../controllers/admin/productController";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/maintenance", setMaintenance);

//CRUD for Post
router.post("/posts", upload.single("image"), createPost);
router.patch("/posts", upload.single("image"), updatePost);
router.delete("/posts", deletePost);

//CRUD for Product
router.post("/products", upload.array("images", 4), createProduct);
router.patch("/products", upload.array("images", 4), updateProduct);
router.delete("/products", deleteProduct);

export default router;
