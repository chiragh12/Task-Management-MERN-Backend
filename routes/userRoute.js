import express from "express";
import { isAuthenticated } from "../middleware/auth.js";
import {
  currentUserProfile,
  registerUser,
  loginUser,
  logoutUser,
} from "../controller/userController.js";
const router = express.Router();
router.post("/login", loginUser);
router.get("/logout", isAuthenticated, logoutUser);
router.get("/myProfile", isAuthenticated,currentUserProfile);
router.post("/register", registerUser);
export default router;
