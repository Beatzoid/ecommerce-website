import userController from "../controllers/userController";

import { Router } from "express";
const router = Router();

router.post("/register", userController.register);
router.get("/refresh_token", userController.refreshToken);

export default router;
