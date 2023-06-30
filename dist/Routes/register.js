"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoute = void 0;
const express_1 = __importDefault(require("express"));
exports.registerRoute = express_1.default.Router();
const register_1 = require("../Controller/register");
exports.registerRoute.get("/fill", register_1.getForm);
exports.registerRoute.post("/submit", register_1.submitForm);
exports.registerRoute.delete("/delete/:id", register_1.deleteForm);
