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
exports.userAuthorization = exports.signinC = exports.signupC = void 0;
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../Validator/user");
const response_1 = require("../Response/response");
const user_2 = require("../Service/user");
const signupC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const { username, email, password, } = req.body;
    try {
        const check = yield db_1.pool.query("SELECT username, email FROM user_info WHERE username = $1 OR email =  $2", [username, email]);
        console.log(check.rows);
        if (check.rows.length > 0) {
            let erroMessage = "";
            if (check.rows[0].username === username && check.rows[0].email === email) {
                // checks if username and email have been used before \
                console.log("yesnno");
                erroMessage = "Email & Username already in use";
            }
            else if (check.rows[0].username === username && check.rows[0].email !== email) {
                // check if only username has been used before
                console.log("yes");
                erroMessage = "Username already in use";
            }
            else if (check.rows[0].username !== username && check.rows[0].email === email) {
                console.log("no");
                // checks if only email has been used before
                erroMessage = "Email already in use";
            }
            res.status(404).send({ message: erroMessage, status: false });
        }
        else {
            // if none has been used before we bcypt the password, save details and send a token
            const bcryptPassword = yield bcryptjs_1.default.hash(password, 10);
            console.log(bcryptPassword);
            const addUser = yield db_1.pool.query("INSERT INTO user_info(username, email, password, img_url) VALUES($1,$2,$3,$4)", [username, email, bcryptPassword, ""]);
            // number zero means we ahve both available
            const jwtToken = jsonwebtoken_1.default.sign({ emailUsername: ` ${username} ${email}`, number: 0 }, `${process.env.JWTTOKEN}`, { expiresIn: "7d" });
            res.status(200).send({ userToken: jwtToken, status: true });
        }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send({ message: "An error occured", status: false });
    }
});
exports.signupC = signupC;
const signinC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailUsername, password, switchChange } = req.body;
        let searchName = "";
        let number = -1;
        if (switchChange) {
            searchName = "email";
            number = 1;
        }
        else {
            searchName = "username";
            number = 2;
        }
        const searchQuery = yield db_1.pool.query(`SELECT username, email, password FROM user_info WHERE ${searchName} = $1`, [emailUsername]);
        const ifValid = () => {
            // number 1 means we only have email available, 2 means we only have username
            const jwtToken = jsonwebtoken_1.default.sign({ emailUsername: emailUsername, number: number }, `${process.env.JWTTOKEN}`, { expiresIn: "1d" });
            res.status(200).send({ userToken: jwtToken, status: true });
        };
        const ifInvalid = (message) => {
            res.status(404).send({ message: message, status: false });
        };
        if (searchQuery.rows.length > 0) {
            const confirmPass = yield bcryptjs_1.default.compare(password, searchQuery.rows[0].password);
            switch (confirmPass) {
                case true:
                    {
                        return ifValid();
                    }
                    ;
                case false: {
                    return ifInvalid("Invalid Password");
                }
            }
        }
        else {
            ifInvalid("Invalid Login Crendentails");
        }
    }
    catch (error) {
        res.status(500).send({ message: "an error occured", status: false });
    }
});
exports.signinC = signinC;
const userAuthorization = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userTokenValidation = yield user_1.UserValidator.validateToken(req);
        if (userTokenValidation instanceof Error) {
            return (0, response_1.errorResponse)(res, 404, false, "Authetication failed");
        }
        const dashDetails = yield user_2.UserService.getDashDetails(`${userTokenValidation.email}`);
        if (dashDetails instanceof Error) {
            return (0, response_1.errorResponse)(res, 404, false, "Authetication failed");
        }
        return (0, response_1.sucessResponse)(res, 201, true, "verified succefully", {
            userDetails: userTokenValidation,
            dashboardDetails: {
                lastestForms: dashDetails.lastestForms,
                lastestResponses: dashDetails.lastestResponses,
                topPerformingForms: []
            }
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, 404, false, error.message);
    }
});
exports.userAuthorization = userAuthorization;
