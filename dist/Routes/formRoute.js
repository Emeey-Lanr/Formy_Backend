"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formRoute = void 0;
const express_1 = __importDefault(require("express"));
const form_1 = require("../Controller/form");
exports.formRoute = express_1.default.Router();
exports.formRoute.post("/add", form_1.addForm);
exports.formRoute.get("/getlink", form_1.getFormLink);
exports.formRoute.post("/delete", form_1.deleteForm);
