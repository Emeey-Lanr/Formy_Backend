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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const db_1 = require("../db");
const user_1 = require("../Validator/user");
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: `${process.env.CLOUDINARY_NAME}`,
    api_key: `${process.env.CLOUDINARY_API_KEY}`,
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});
class UserService {
    static getDashDetails(userEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const allFormResponse = yield db_1.pool.query("SELECT * FROM register WHERE owner_id = $1", [userEmail]);
                const allForm = yield db_1.pool.query("SELECT * FROM form WHERE userid = $1", [userEmail]);
                const lastestForms = allForm.rows.filter((_, id) => id > allForm.rows.length - 11).reverse();
                const lastestResponses = allFormResponse.rows.filter((_, id) => id > allFormResponse.rows.length - 11).reverse();
                const topThree = yield user_1.UserValidator.ValidateTopThreeRanks(allFormResponse.rows);
                return { lastestForms, lastestResponses, topThree };
            }
            catch (error) {
                return new Error(error.message);
            }
        });
    }
    static uploadProfileImgae(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, img } = payload;
            try {
                const uploadImg = yield cloudinary_1.v2.uploader.upload(img, { public_id: `${email}_formy` });
                const updateUser = yield db_1.pool.query("UPDATE user_info SET img_url = $1  WHERE email = $2 ", [`${uploadImg.secure_url}`, `${email}`]);
            }
            catch (error) {
                return new Error(error.message);
            }
        });
    }
}
exports.UserService = UserService;
