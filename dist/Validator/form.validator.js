"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getformValidator = exports.checkIfFormExist = void 0;
const db_1 = require("../db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkIfFormExist = (userId, formTitle) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const check = yield db_1.pool.query("SELECT form_title FROM form WHERE userId = $1 AND form_title = $2", [userId, formTitle]);
        if (check.rows.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        return error;
    }
});
exports.checkIfFormExist = checkIfFormExist;
const getformValidator = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const verifyToken = jsonwebtoken_1.default.verify(`${token}`, `${process.env.JWTTOKEN}`);
        let searchId = "";
        let searchRoute = "";
        if (verifyToken.number === 0) {
            searchId = verifyToken.emailUsername.split(" ")[2];
            searchRoute = "email";
        }
        else if (verifyToken.number === 1) {
            searchId = verifyToken.emailUsername;
            searchRoute = "email";
        }
        else if (verifyToken.number === 2) {
            searchId = verifyToken.emailUsername;
            searchRoute = "username";
        }
        const lookForUserQuery = yield db_1.pool.query(`SELECT email FROM user_info WHERE ${searchRoute} = $1`, [searchId]);
        console.log(lookForUserQuery.rows);
        const lookForUserForm = yield db_1.pool.query("SELECT * FROM form WHERE userId = $1", [lookForUserQuery.rows[0].email]);
        return lookForUserForm.rows;
    }
    catch (error) {
        return new error;
    }
});
exports.getformValidator = getformValidator;
