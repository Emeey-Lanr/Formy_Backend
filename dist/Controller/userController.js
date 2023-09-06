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
exports.changeForgotPassword = exports.emailTokenVerification = exports.emailPasswordVerification = exports.changeUserPassword = exports.uploadUserProfileImg = exports.userAuthorization = exports.signinC = exports.signupC = void 0;
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../Validator/user");
const response_1 = require("../Response/response");
const user_2 = require("../Service/user");
const signupC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, } = req.body;
    try {
        const check = yield db_1.pool.query("SELECT username, email FROM user_info WHERE username = $1 OR email =  $2", [username, email]);
        if (check.rows.length > 0) {
            let erroMessage = "";
            if (check.rows[0].username === username && check.rows[0].email === email) {
                // checks if username and email have been used before \
                erroMessage = "Email & Username already in use";
            }
            else if (check.rows[0].username === username && check.rows[0].email !== email) {
                // check if only username has been used before
                erroMessage = "Username already in use";
            }
            else if (check.rows[0].username !== username && check.rows[0].email === email) {
                // checks if only email has been used before
                erroMessage = "Email already in use";
            }
            res.status(404).send({ message: erroMessage, status: false });
        }
        else {
            // if none has been used before we bcypt the password, save details and send a token
            const bcryptPassword = yield bcryptjs_1.default.hash(password, 10);
            const addUser = yield db_1.pool.query("INSERT INTO user_info(username, email, password, img_url) VALUES($1,$2,$3,$4)", [username, email, bcryptPassword, ""]);
            // number zero means we ahve both available
            const jwtToken = jsonwebtoken_1.default.sign({ emailUsername: ` ${username} ${email}`, number: 0 }, `${process.env.JWTTOKEN}`, { expiresIn: "7d" });
            res.status(200).send({ userToken: jwtToken, status: true });
        }
    }
    catch (error) {
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
                topPerformingForms: dashDetails.topThree
            }
        });
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, 404, false, error.message);
    }
});
exports.userAuthorization = userAuthorization;
const uploadUserProfileImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const upload = yield user_2.UserService.uploadProfileImgae(req.body);
        if (upload instanceof Error) {
            return (0, response_1.errorResponse)(res, 500, false, "An error occured");
        }
        return (0, response_1.sucessResponse)(res, 201, true, "Img profile uploaded succesfully");
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, 500, false, "internal server error");
    }
});
exports.uploadUserProfileImg = uploadUserProfileImg;
const changeUserPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatePassword = yield user_1.UserValidator.changePassword(`${req.body.email}`, `${req.body.oldPassword}`, `${req.body.newPassword}`);
        if (validatePassword instanceof Error) {
            return (0, response_1.errorResponse)(res, 404, false, validatePassword.message);
        }
        return (0, response_1.sucessResponse)(res, 201, true, "password updated succesfully");
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, 500, false, "internal server error");
    }
});
exports.changeUserPassword = changeUserPassword;
const emailPasswordVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = yield user_1.UserValidator.emailVerification(req.body.email);
        if (email instanceof Error) {
            return (0, response_1.errorResponse)(res, 400, false, `${email.message}`);
        }
        return (0, response_1.sucessResponse)(res, 201, true, `Check your inbox or spam to reset password`);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, 500, false, "An error occured");
    }
});
exports.emailPasswordVerification = emailPasswordVerification;
const emailTokenVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        const verifyToken = yield user_1.UserValidator.emailTokenVerification(`${token}`);
        if (verifyToken instanceof Error) {
            return (0, response_1.errorResponse)(res, 400, false, `${verifyToken.message}`);
        }
        return (0, response_1.sucessResponse)(res, 201, true, `verification succesfull`, { verifyToken });
    }
    catch (error) {
        return (0, response_1.sucessResponse)(res, 201, true, "password updated succesfully");
    }
});
exports.emailTokenVerification = emailTokenVerification;
const changeForgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const verify = yield user_1.UserValidator.changePasswordEmailVerification(email, password);
        if (verify instanceof Error) {
            return (0, response_1.errorResponse)(res, 400, false, `${verify.message}`);
        }
        return (0, response_1.sucessResponse)(res, 201, true, `Updated Succesfully`);
    }
    catch (error) {
        return (0, response_1.errorResponse)(res, 500, false, "An error occured");
    }
});
exports.changeForgotPassword = changeForgotPassword;
