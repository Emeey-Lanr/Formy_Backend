import { pool } from "../db"
import { UserValidator } from "../Validator/user"
import {v2 as cloudinary} from 'cloudinary';
import nodemailer from "nodemailer"
import emailToken from "jsonwebtoken";
import bcrypt from "bcryptjs"
cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});
 

export class UserService {
    static async getDashDetails(userEmail:string) {
        try {
            const allFormResponse = await pool.query("SELECT * FROM register WHERE owner_id = $1", [userEmail])
            const allForm = await pool.query("SELECT * FROM form WHERE userid = $1", [userEmail])
            const lastestForms = allForm.rows.filter((_, id)=> id > allForm.rows.length - 11).reverse()
            const lastestResponses = allFormResponse.rows.filter((_, id) => id > allFormResponse.rows.length - 11).reverse()
            const topThree = await UserValidator.ValidateTopThreeRanks(allFormResponse.rows)

            return {lastestForms, lastestResponses, topThree}
          
      
        } catch (error: any) {
          
            return new Error(error.message)
        }
    }
    static async uploadProfileImgae(payload:{email:string, img:string}) {
        const {email, img} = payload
        try {
             const uploadImg = await cloudinary.uploader.upload(img, { public_id: `${email}_formy` })
            const updateUser = await pool.query(
              "UPDATE formy_user_info SET img_url = $1  WHERE email = $2 ",[`${uploadImg.secure_url}`, `${email}`]
            );

        } catch (error:any) {
          return new Error(error.message)   
        }
       
       
  }
  static async sendVerifactionMail(email:string) {
    try {
      const token = emailToken.sign({email}, `${process.env.EMAIL_JWT_TOKEN }`, {expiresIn:"4hr"})
      
      var transporter = nodemailer.createTransport({
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
        <p style="font-size: 0.9rem; line-height: 30px; width: 100%; margin: 0  auto 10px auto; background: #fafafa;box-sizing: border-box; text-align: justify; padding: 30px 10px; border-radius: 5px;">
          You've requested to reset your forgotten password,
          Click on the button below to rest password.
          <br>
          It expires in 4 hrs.
         </p>
         <div styele="width:300px; margin:0 auto;">
           <a href="http://localhost:3000/reset/${token}" style=" text-decoration: none; ">
      
          <button style="background:#2c3cec; text-align:center;font-size: 0.8rem;  border:none; width:100%; height:40px;color:white;">
            Reset
   
          </button>
              </a>
         </div>
      

        </div>
       
    </div>`,
      };
      
      const sendMail = await transporter.sendMail(mailOption)
        let message = "Mail sent succesfully"
      return message
    } catch (error) {
      return new Error("An error occured")
    }
  }
  static async changePassword(email: string, password: string) {
    try {
      const hash_password = await bcrypt.hash(`${password}`, 10)
     
      const updatePassword = await pool.query("UPDATE formy_user_info SET password = $1 WHERE email = $2", [hash_password, email])
      let message = "Updated succesfully"
      return message
    } catch (error) {
      return new Error("an error occured")
    }
    
  } 
}

