import { Router } from "express";
const router = Router();

import auth from "../middleware/auth";
import authAdmin from "../middleware/authAdmin";
import categoryController from "../controllers/categoryController";

router
    .route("/category")
    .get(categoryController.getCategories)
    .post(auth, authAdmin, categoryController.createCategory);

router
    .route("/category/:id")
    .delete(auth, authAdmin, categoryController.deleteCategory)
    .put(auth, authAdmin, categoryController.updateCategory);

export default router;
