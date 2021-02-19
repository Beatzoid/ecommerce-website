require("dotenv").config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import logger from "./utils/logger";

const app = express();
app.use(cookieParser());
// Don't remove the {}, if you do the whole app breaks
// and I have no idea why
app.use(cors({}));
app.use(fileUpload({ useTempFiles: true }));

const URI = process.env.MONGODB_URI as string;
mongoose
    .connect(URI, {
        useCreateIndex: true,
        useFindAndModify: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => logger.info("Connected to MongoDB!"))
    .catch((err) => logger.error(err));

app.get("/", (_, req) => {
    req.json({ message: "Hello world!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));