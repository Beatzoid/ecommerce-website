import cloudinary from "cloudinary";
import fs from "fs";
import { UploadedFile } from "express-fileupload";

import auth from "../middleware/auth";
import adminAuth from "../middleware/authAdmin";

import { Router } from "express";
const router = Router();

router.post("/upload", auth, adminAuth, (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0)
            return res
                .status(400)
                .json({ error: "You must provide images to be uploaded" });

        const file = req.files.file as UploadedFile;

        if (file.size > 1024 * 1024) {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ error: "The image is too big" });
        }

        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
            removeTmp(file.tempFilePath);
            return res.status(400).json({ error: "Invalid file format" });
        }

        cloudinary.v2.uploader.upload(
            file.tempFilePath,
            { folder: "test" },
            async (err, result) => {
                if (err) throw err;

                removeTmp(file.tempFilePath);

                return res.json({
                    public_id: result?.public_id,
                    url: result?.secure_url
                });
            }
        );

        // To make Typescript happy
        return;
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post("/destroy", auth, adminAuth, (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id)
            return res.status(400).json({
                error: "You must provide an id for the image to delete"
            });

        cloudinary.v2.uploader.destroy(public_id, async (err: any) => {
            if (err) throw err;

            res.json({ msg: "Successfully deleted Image" });
        });

        // Typescript
        return;
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

const removeTmp = (path: string) => {
    fs.unlink(path, (err) => {
        if (err) throw err;
    });
};

export default router;
