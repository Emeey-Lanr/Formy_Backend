import { Request, Response } from "express" 
import { pool } from "../db"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"


export const signupC = async(req: Request, res: Response) => {
    console.log(req.body)
    const {username, email, password,  } = req.body
    try {
        const check = await pool.query("SELECT username, email FROM user_info WHERE username = $1 OR email =  $2", [username, email])
        console.log(check.rows)
        if (check.rows.length > 0) {
            let erroMessage = ""
            if (check.rows[0].username === username && check.rows[0].email === email) {
                // checks if username and email have been used before \
                console.log("yesnno")
                erroMessage = "Email & Username already in use"
           
            } else if (check.rows[0].username === username && check.rows[0].email !== email) {
                // check if only username has been used before
                console.log("yes")
               erroMessage = "Username already in use"
            } else if (check.rows[0].username !== username && check.rows[0].email === email) {
                console.log("no")
                // checks if only email has been used before
              erroMessage = "Email already in use"
            }
              res.status(404).send({ message: erroMessage, status: false })
        } else {
            // if none has been used before we bcypt the password, save details and send a token
            const bcryptPassword = await bcryptjs.hash(password, 10)
            console.log(bcryptPassword)
            const addUser = await pool.query("INSERT INTO user_info(username, email, password, img_url) VALUES($1,$2,$3,$4)", [username, email, bcryptPassword, ""])
        
            const jwtToken = jwt.sign({ username, password }, `${process.env.JWTTOKEN}`, { expiresIn: "7d" })
            res.status(200).send({userToken:jwtToken, status:true})
        }   
       
    } catch (error:any) {
        console.log(error.message)
        res.send(500).send({ message: "An error occured", status: false })
    }
    
    
}

export const signinC = (req: Request, res: Response) => {
    
}