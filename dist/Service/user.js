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
exports.UserService = void 0;
const db_1 = require("../db");
const user_1 = require("../Validator/user");
const cloudinary_1 = require("cloudinary");
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
    static sendVerifactionMail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = jsonwebtoken_1.default.sign({ email }, `${process.env.EMAIL_JWT_TOKEN}`, { expiresIn: "4hr" });
                var transporter = nodemailer_1.default.createTransport({
                    service: "gmail",
                    auth: {
                        user: `${process.env.Email}`,
                        pass: `${process.env.EmailPass}`,
                    },
                });
                var mailOption = {
                    from: "",
                    to: email,
                    subject: `Formy Password Verification`,
                    text: `hello`,
                    html: ` <div style="width:370px; height: 100%; margin:0 auto; position: fixed; top: 0; display: flex; justify-content: center; font-family: sans-serif;">
        <div style="width: 95%;">
             <h1 style="text-align: center; color: #2c3cec; ">Formy</h1>
        <p style="font-size: 0.9rem; line-height: 30px; width: 80%; margin: 0  auto 10px auto; background: #fafafa;box-sizing: border-box; text-align: justify; padding: 30px 5px; border-radius: 5px;">
          You've requested to reset your forgotten password,
          Click on the button below to rest password.
          <br>
          It expires in 4 hrs.
         </p>
         <div styele="width:300px; margin:0 auto;">
          <button style="background:#2c3cec; border:none; width:100%; height:40px;">
           <a href="http://localhost:3000/reset/${token}" style="font-size: 0.8rem;  text-decoration: none; width: 100%; text-align: center;">
         Reset
       </a>
          </button>
         </div>
      

        </div>
       
    </div>`,
                };
                const sendMail = yield transporter.sendMail(mailOption);
                let message = "Mail sent succesfully";
                return message;
            }
            catch (error) {
                return new Error("An error occured");
            }
        });
    }
    static changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hash_password = yield bcryptjs_1.default.hash(`${password}`, 10);
                const updatePassword = yield db_1.pool.query("UPDATE user_info SET password = $1 WHERE email = $2", [hash_password, email]);
                let message = "Updated succesfully";
                return message;
            }
            catch (error) {
                return new Error("an error occured");
            }
        });
    }
}
exports.UserService = UserService;
