import { pool } from "../db"
import jwt from "jsonwebtoken"
import { jwtPayload } from "../Interface/jwt"
import { Request } from "express"
export const checkIfFormExist = async (userId:string ,formTitle:string) => {
    try {
     const check = await pool.query("SELECT form_title FROM form WHERE userId = $1 AND form_title = $2", [userId, formTitle])
 
     if (check.rows.length > 0) {
         return true
     } else {
         return false
     }
 } catch (error) {
    return error
 }   
}

export const getformValidator = async (req:Request) => {
    try {
        let token = req.headers.authorization?.split(" ")[1]
     
        const verifyToken = jwt.verify(`${token}`, `${process.env.JWTTOKEN}`)  as jwtPayload
 
        let searchId = ""
        let searchRoute = ""
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
        const lookForUserQuery = await pool.query(`SELECT email FROM formy_user_info WHERE ${searchRoute} = $1`, [searchId])
     
        const lookForUserForm = await pool.query("SELECT * FROM form WHERE userId = $1", [lookForUserQuery.rows[0].email])

        return lookForUserForm.rows


    } catch (error:any) {
       return new error
    }
    
}