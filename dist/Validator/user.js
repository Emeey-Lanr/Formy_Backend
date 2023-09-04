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
exports.UserValidator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserValidator {
    static validateToken(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ");
                if (userToken) {
                    const verifyToken = jsonwebtoken_1.default.verify(`${userToken[1]}`, `${process.env.JWTTOKEN}`);
                    let searchRoute = "";
                    let searchId = "";
                    // we check based on the number what we have
                    // if it's 0 we have both email and username wrapped together as a string
                    // the rest we have based on the prefrence of the user
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
                    const userDetails = yield db_1.pool.query(`SELECT username, email, img_url FROM user_info WHERE ${searchRoute} = $1`, [searchId]);
                    return userDetails.rows[0];
                }
            }
            catch (error) {
                return new Error(error.message);
            }
        });
    }
    static ValidateTopThreeRanks(allFormResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const topThree = [];
                const topThreeCalculation = allFormResponse.map((details, id) => {
                    if (topThree.find((data) => data.link === details.form_link)) {
                        // topThree[id].totalSubmit = topThree[id].totalSubmit + 1
                        const response = topThree.find((data) => data.link === details.form_link);
                        if (response) {
                            response.totalSubmit = response.totalSubmit + 1;
                        }
                    }
                    else {
                        topThree.push({ form_title: details.form_title, form_description: details.form_description, link: details.form_link, totalSubmit: 1 });
                    }
                });
                const sortResponses = topThree.sort((a, b) => b.totalSubmit - a.totalSubmit);
                const ranking = [];
                let rank = 1;
                for (let i = 0; i < sortResponses.length; i++) {
                    if (i > 0 && sortResponses[i].totalSubmit !== sortResponses[i - 1].totalSubmit) {
                        rank = i + 1;
                    }
                    ranking.push({
                        form_title: sortResponses[i].form_title,
                        form_description: sortResponses[i].form_description,
                        form_link: sortResponses[i].link,
                        totalSubmit: sortResponses[i].totalSubmit,
                        rank,
                    });
                }
                const topThreeRanking = ranking.filter((details, id) => details.rank < 4);
                return topThreeRanking;
            }
            catch (error) {
            }
        });
    }
    static changePassword(email, oldPassword, newPassWord) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUserOldPassword = yield db_1.pool.query("SELECT password FROM user_info WHERE email  = $1", [email]);
                const checkIfPassworMatches = yield bcryptjs_1.default.compare(oldPassword, getUserOldPassword.rows[0].password);
                console.log(checkIfPassworMatches);
                if (!checkIfPassworMatches) {
                    return new Error("Invalid old password");
                }
                const encryptedNewPassword = yield bcryptjs_1.default.hash(newPassWord, 10);
                console.log(encryptedNewPassword);
                const changePasswordOldPasswordWithNew = yield db_1.pool.query("UPDATE user_info SET password = $1 WHERE email = $2", [encryptedNewPassword, email]);
            }
            catch (error) {
                return new Error(error.message);
            }
        });
    }
}
exports.UserValidator = UserValidator;
