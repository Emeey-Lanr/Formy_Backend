"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const formRoute_1 = require("./Routes/formRoute");
const userRoute_1 = require("./Routes/userRoute");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
// const userRoute = require("./Routes/userRoute")
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT;
app.use("/user", userRoute_1.userRoute);
app.use("/form", formRoute_1.formRoute);
app.listen(PORT, () => {
    console.log(`app has started at port ${PORT}`);
});
