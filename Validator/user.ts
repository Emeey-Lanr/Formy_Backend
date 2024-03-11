import { Request, response } from "express"
import jwt from "jsonwebtoken"
import { pool } from "../db"
import { jwtPayload, SubmitFormPayload, TopThree, Ranking } from "../Interface/jwt"
import bcrypt from "bcryptjs"
import { UserService } from "../Service/user"

const emailVerificationF = async (email:string) => {
    try {
        
     const checkIFEmailExist = await pool.query(
       "SELECT email FROM formy_user_info WHERE email = $1",
       [email]
    );
   
     if (checkIFEmailExist.rows[0].email !== email) {
       return new Error("Invalid Email Address");
    }
    
    return checkIFEmailExist.rows[0].email;
    } catch (err) {
        return new Error("An error occured")

    }

}

export class UserValidator {
    static async validateToken(req: Request) {
           try {
            const userToken = req.headers.authorization?.split(" ")
        
            if (userToken) {
                const verifyToken =   jwt.verify(`${userToken[1]}`, `${process.env.JWTTOKEN}`) as jwtPayload
           
                let searchRoute = ""
                let searchId = ""
                // we check based on the number what we have
                // if it's 0 we have both email and username wrapped together as a string
                // the rest we have based on the prefrence of the user
            
                if (verifyToken.number === 0) {
                    searchId = verifyToken.emailUsername.split(" ")[2]
                    searchRoute = "email"
                } else if (verifyToken.number === 1) {
                    searchId = verifyToken.emailUsername
                    searchRoute = "email"
                
                } else if (verifyToken.number === 2) {
                    searchId = verifyToken.emailUsername
                    searchRoute = "username"
                }

                const userDetails = await pool.query(`SELECT username, email, img_url FROM formy_user_info WHERE ${searchRoute} = $1`, [searchId])
                return userDetails.rows[0]
            }
           } catch (error:any ) {
               return new Error(error.message)
        }
    }
    static async ValidateTopThreeRanks(allFormResponse: SubmitFormPayload[]) {
        try {
               const topThree: TopThree[] = [];
        
            const topThreeCalculation =  allFormResponse.map((details, id) => {
             
                if (topThree.find((data) => data.link === details.form_link)) {
                    // topThree[id].totalSubmit = topThree[id].totalSubmit + 1
                    const response = topThree.find((data) => data.link === details.form_link)
                    if (response) {
                        response.totalSubmit = response.totalSubmit + 1
                    }
                    
                } else {
                    topThree.push({form_title:details.form_title, form_description:details.form_description, link:details.form_link, totalSubmit:1})
                }
            
            }) 
            const sortResponses = topThree.sort((a, b) => b.totalSubmit - a.totalSubmit)

           const ranking:Ranking[] = []
            let rank = 1
            for (let i = 0; i < sortResponses.length; i++){
               if (i > 0 && sortResponses[i].totalSubmit !== sortResponses[i - 1].totalSubmit) {
                 rank = i + 1
             
                }
                
             ranking.push({
               form_title:sortResponses[i].form_title,
               form_description: sortResponses[i].form_description,
               form_link: sortResponses[i].link,
               totalSubmit: sortResponses[i].totalSubmit,
               rank,
             });
          
            }
 
          const topThreeRanking = ranking.filter((details, id)=> details.rank < 4 )
            return topThreeRanking;
        } catch (error) {
            
        }
       
        
    }

    static async changePassword(email:string, oldPassword:string, newPassWord:string) {
        try {
            const getUserOldPassword = await pool.query("SELECT password FROM formy_user_info WHERE email  = $1", [email])
            const checkIfPassworMatches = await bcrypt.compare(oldPassword, getUserOldPassword.rows[0].password)
           
            if (!checkIfPassworMatches) {
                return new Error("Invalid old password")
            }
           
            const encryptedNewPassword = await bcrypt.hash(newPassWord, 10)
        
            const changePasswordOldPasswordWithNew = await pool.query("UPDATE formy_user_info SET password = $1 WHERE email = $2", [encryptedNewPassword, email])
        
        } catch (error:any) {
         return new Error(error.message)    
        }
    
    }
    static async emailVerification(email:string) {
        try {
            const verify = await emailVerificationF(email)
            if (verify instanceof Error) {
                return new Error(verify.message)
            }
            const sendEmail = await UserService.sendVerifactionMail(email)
            if (sendEmail instanceof Error) {
                 return new Error("An error occured, reload and try again")
             }
            
        } catch (error) {
            return new Error("An error occured")
        }
    }
    static async emailTokenVerification(token: string) {
        try {
            const verifyToken = jwt.verify(`${token}`, `${process.env.EMAIL_JWT_TOKEN}`)
            return verifyToken
        } catch (error) {
          return new Error("An error occured");   
        }
        
    }
    static async changePasswordEmailVerification(email: string, password:string) {
        try {
            const verifyEmail = await emailVerificationF(email)
            if (verifyEmail instanceof Error) {
                return new Error(verifyEmail.message)
            }
            const changePasword = await UserService.changePassword(email, password)
            if (changePasword instanceof Error) {
                return new Error(changePasword.message)
            }
            return changePasword
        
        } catch (error) {
               return new Error("an error occured");
        }
        
    }
}