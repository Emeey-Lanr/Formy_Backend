"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const route = express_1.default.Router();
const userController_1 = require("../Controller/userController");
route.post("/signup", userController_1.signupC);
route.post("/signin", userController_1.signinC);
module.exports = route;
