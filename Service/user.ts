import { pool } from "../db"
import { UserValidator } from "../Validator/user"
import {v2 as cloudinary} from 'cloudinary';
          
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
              "UPDATE user_info SET img_url = $1  WHERE email = $2 ",[`${uploadImg.secure_url}`, `${email}`]
            );

        } catch (error:any) {
          return new Error(error.message)   
        }
       
       
    }
}

