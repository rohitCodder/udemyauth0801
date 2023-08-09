import express from "express";
import {
  changePassword,
  getmyprofile,
  login,
  logout,
  register,
  updateprofile,
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(isAuthenticated, getmyprofile);
router.route("/logout").get(isAuthenticated, logout);
router.route("/updateprofile").put(isAuthenticated, updateprofile);
router.route("/changepassword").put(isAuthenticated, changePassword);

export default router;
