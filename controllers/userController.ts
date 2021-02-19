import { Request, Response } from "express";
import Users from "../models/userModel";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const userController = {
    register: async (req: Request, res: Response) => {
        try {
            const { name, email, password } = req.body;

            const user = await Users.findOne({ email });
            if (user)
                return res.status(400).json({ error: "Email already in use" });

            if (password.length < 6)
                return res.status(400).json({
                    error: "Password must be at least 6 characters long"
                });

            // Password encryption
            const passwordHash = await argon2.hash(password, {
                hashLength: 10000,
                saltLength: 1000,
                timeCost: 100
            });
            const newUser = new Users({ name, email, password: passwordHash });

            // Save the new user to the database
            await newUser.save();

            // Create JSON Web Token
            const accesstoken = createAccessToken({ id: newUser._id });
            const refreshtoken = createRefreshToken({ id: newUser._id });

            res.cookie("refreshtoken", refreshtoken, {
                httpOnly: true,
                path: "/users/refresh_token"
            });

            return res.json({ accesstoken });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },
    // @ts-ignore
    refreshToken: async (req: Request, res: Response) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token)
                return res
                    .status(400)
                    .json({ error: "Please login or register" });

            jwt.verify(
                rf_token,
                process.env.REFRESH_TOKEN_SECRET as string,
                (err: any, user: any) => {
                    if (err)
                        return res
                            .status(400)
                            .json({ error: "Please login or register" });

                    const accesstoken = createAccessToken({ id: user.id });
                    return res.json({ accesstoken });
                }
            );
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
};

const createAccessToken = (user: any) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
        expiresIn: "7d"
    });
};

const createRefreshToken = (user: any) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: "7d"
    });
};

export default userController;
