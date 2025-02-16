import {
  logout,
  signIn,
  signUp,
  getMe,
} from "../controllers/auth.controller.js";
import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", logout);
router.get("/me", protectRoute, getMe);

export default router;
