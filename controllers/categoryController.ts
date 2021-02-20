import { Request, Response } from "express";
import Category from "../models/categoryModel";

const categoryController = {
    getCategories: async (_: Request, res: Response) => {
        try {
            const categories = await Category.find({});
            return res.json(categories);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },
    createCategory: async (req: Request, res: Response) => {
        try {
            const { name } = req.body;
            const category = await Category.findOne({ name });
            if (category)
                return res
                    .status(400)
                    .json({ error: "Category already exists" });

            const newCategory = new Category({ name });
            await newCategory.save();
            return res.json({ message: "Successfully created category" });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },
    deleteCategory: async (req: Request, res: Response) => {
        try {
            await Category.findByIdAndDelete(req.params.id);
            return res.json({ message: "Successfully deleted category" });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },
    updateCategory: async (req: Request, res: Response) => {
        try {
            const { name } = req.body;
            await Category.findOneAndUpdate({ _id: req.params.id }, { name });

            return res.json({ message: "Updated successfully" });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
};

export default categoryController;
