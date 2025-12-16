import express from "express";
import {
  loginUser,
  registerUser,
  updateUser,
  updateProfilePic
} from "../controllers/authController.js";
import { uploadMiddleware } from "../middleware/uploadMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/login", loginUser);
authRoutes.post("/register", registerUser);
authRoutes.put("/update", authMiddleware, updateUser);
authRoutes.put(
  "/updatepic",
  authMiddleware,
  uploadMiddleware.single("avatar"),
  updateProfilePic
);

export default authRoutes;
