"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const logger_1 = __importDefault(require("./utils/logger"));
const app = express_1.default();
app.use(cookie_parser_1.default());
app.use(cors_1.default({}));
app.use(express_fileupload_1.default({ useTempFiles: true }));
const URI = process.env.MONGODB_URI;
mongoose_1.default
    .connect(URI, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => logger_1.default.info("Connected to MongoDB!"))
    .catch((err) => logger_1.default.error(err));
app.get("/", (_, req) => {
    req.json({ message: "Hello world!" });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger_1.default.info(`Server listening on port ${PORT}`));
//# sourceMappingURL=server.js.map