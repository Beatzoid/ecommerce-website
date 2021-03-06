import userController from "../controllers/userController";

import { Router } from "express";
import auth from "../middleware/auth";
const router = Router();

router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

router.get("/refresh_token", userController.refreshToken);

router.get("/info", auth, userController.getUser);

export default router;
