import { NextFunction, Request, Response } from "express";
import { MyRequest } from "utils/types";
import Users from "../models/userModel";

const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get user information by id
        const user: any = await Users.findOne({
            _id: (req as MyRequest).user.id
        });

        if (user.role === 0)
            return res.status(401).json({ error: "Admin access denied" });

        return next();
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export default authAdmin;
