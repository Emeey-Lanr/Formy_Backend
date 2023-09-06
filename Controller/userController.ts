import { Request, Response } from "express" 
import { pool } from "../db"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { jwtPayload } from "../Interface/jwt"
import { UserValidator } from "../Validator/user"
import { errorResponse, sucessResponse } from "../Response/response"
import { UserService } from "../Service/user"
import { emit } from "process"

export const signupC = async(req: Request, res: Response) => {
   
    const {username, email, password,  } = req.body
    try {
        const check = await pool.query("SELECT username, email FROM user_info WHERE username = $1 OR email =  $2", [username, email])
     
        if (check.rows.length > 0) {
            let erroMessage = ""
            if (check.rows[0].username === username && check.rows[0].email === email) {
                // checks if username and email have been used before \
              
                erroMessage = "Email & Username already in use"
           
            } else if (check.rows[0].username === username && check.rows[0].email !== email) {
                // check if only username has been used before
               
                erroMessage = "Username already in use"
            } else if (check.rows[0].username !== username && check.rows[0].email === email) {
               
                // checks if only email has been used before
                erroMessage = "Email already in use"
            }
            res.status(404).send({ message: erroMessage, status: false })
        } else {
            // if none has been used before we bcypt the password, save details and send a token
            const bcryptPassword = await bcryptjs.hash(password, 10)
           
            const addUser = await pool.query("INSERT INTO user_info(username, email, password, img_url) VALUES($1,$2,$3,$4)", [username, email, bcryptPassword, ""])
            // number zero means we ahve both available
            const jwtToken = jwt.sign({ emailUsername:` ${ username } ${ email }`, number: 0 }, `${process.env.JWTTOKEN}`, { expiresIn: "7d" })
            res.status(200).send({userToken:jwtToken, status:true})
        }   
       
    } catch (error:any) {
   
        res.status(500).send({ message: "An error occured", status: false })
    }
    
    
}

export const signinC = async (req: Request, res: Response) => {
    try{
        const { emailUsername, password, switchChange } = req.body
        let searchName = ""
        let number = -1
        if (switchChange) {
            searchName = "email"
            number = 1
           
        } else {
            searchName = "username"
            number = 2
        }
        const searchQuery = await pool.query(`SELECT username, email, password FROM user_info WHERE ${searchName} = $1`, [emailUsername])
        const ifValid = () => {
            // number 1 means we only have email available, 2 means we only have username
            const jwtToken = jwt.sign({ emailUsername:emailUsername, number:  number}, `${process.env.JWTTOKEN}`, { expiresIn: "1d" })
            res.status(200).send({userToken:jwtToken, status:true})
            
        }
        const ifInvalid = (message:string) => {
             res.status(404).send({message:message, status:false})   
        }
        if (searchQuery.rows.length > 0) {
            const confirmPass = await bcryptjs.compare(password, searchQuery.rows[0].password)
            switch (confirmPass) {
                case true: {
                    return ifValid()
                }; case false: {
                    return ifInvalid("Invalid Password")
                }
            }
        } else {
          ifInvalid("Invalid Login Crendentails")
        }
        
    } catch (error:any) {
        res.status(500).send({message:"an error occured", status:false})
    }

    
}

export const userAuthorization = async (req:Request, res:Response)=>{
    try {
        const userTokenValidation = await UserValidator.validateToken(req)
        if (userTokenValidation instanceof Error) {
            return errorResponse(res, 404, false, "Authetication failed")
        }
        const dashDetails = await UserService.getDashDetails(`${userTokenValidation.email}`)
        if (dashDetails instanceof Error) {
            return errorResponse(res, 404, false, "Authetication failed");
        }

        return sucessResponse(res, 201, true, "verified succefully", {
            userDetails: userTokenValidation,
            dashboardDetails: {
                lastestForms: dashDetails.lastestForms,
                lastestResponses: dashDetails.lastestResponses,
                topPerformingForms:dashDetails.topThree
            }
        })
     
       
    } catch (error: any) {
   
         return errorResponse(res, 404, false, error.message)
    }

}


export const uploadUserProfileImg = async (req: Request, res: Response) => {
    try {
        const upload = await UserService.uploadProfileImgae(req.body)
        if (upload instanceof Error) {
             return errorResponse(res, 500, false, "An error occured");
        }
        return sucessResponse(res, 201, true, "Img profile uploaded succesfully");
        
    } catch (error) {
           return errorResponse(res, 500, false, "internal server error");
    }
    
} 
export const changeUserPassword = async (req: Request, res: Response) => {
    try {
        const validatePassword = await UserValidator.changePassword(`${req.body.email}`, `${req.body.oldPassword}`, `${req.body.newPassword}`)
        if (validatePassword instanceof Error) {
            return errorResponse(res, 404, false, validatePassword.message)
        }
        return sucessResponse(res, 201, true, "password updated succesfully")
    } catch (error) {
        return errorResponse(res, 500, false, "internal server error")
  }
};
export const emailPasswordVerification = async (req:Request, res:Response)=>{
 try {
   
     const email = await UserValidator.emailVerification(req.body.email)
     if (email instanceof Error) {
          return errorResponse(res, 400, false, `${email.message}`);
     }
      return sucessResponse(res, 201, true, `Email sent successfully. Check your inbox or spam to reset password`);
 } catch (error) {
           return errorResponse(res, 500, false, "An error occured");
 }

    
}

export const emailTokenVerification = async (req: Request, res: Response) => {
    try {

        const token = req.headers.authorization?.split(" ")[1]

        const verifyToken = await UserValidator.emailTokenVerification(
          `${token}`
        ); 
        
        if (verifyToken instanceof Error) {
                      return errorResponse(res, 400, false, `${verifyToken.message}`);
        }
        
         return sucessResponse(res, 201, true, `verification succesfull`, {verifyToken});
    } catch (error) {
           return sucessResponse(res, 201, true, "password updated succesfully")
    }
}

export const changeForgotPassword = async (req: Request, res: Response) => {
   const {email,password} = req.body
    try {
         const verify = await UserValidator.changePasswordEmailVerification(email, password)
        if (verify instanceof Error) {
            return errorResponse(res, 400, false, `${verify.message}`);
            
        }
        return sucessResponse(res, 201, true, `Updated Succesfully`);
        
    } catch (error) {
             return errorResponse(res, 500, false, "An error occured");   
    }
} 