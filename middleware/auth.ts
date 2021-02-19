import jwt from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";
import { MyRequest } from "utils/types";

// @ts-ignore
const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization");
        if (!token)
            return res.status(500).json({ error: "Invalid Authentication" });

        jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string,
            (err: any, user: any) => {
                if (err)
                    return res
                        .status(500)
                        .json({ error: "Invalid Authentication" });

                (req as MyRequest).user = user;
                return next();
            }
        );
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export default auth;
