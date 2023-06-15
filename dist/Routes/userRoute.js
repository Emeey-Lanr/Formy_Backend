"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
exports.userRoute = express_1.default.Router();
const userController_1 = require("../Controller/userController");
exports.userRoute.post("/signup", userController_1.signupC);
exports.userRoute.post("/signin", userController_1.signinC);
exports.userRoute.get("/authorizeuser", userController_1.userAuthorization);
