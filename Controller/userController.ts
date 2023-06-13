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
            // number zero means we ahve both available
            const jwtToken = jwt.sign({ emailUsername:` ${ username } ${ email }`, number: 0 }, `${process.env.JWTTOKEN}`, { expiresIn: "7d" })
            res.status(200).send({userToken:jwtToken, status:true})
        }   
       
    } catch (error:any) {
        console.log(error.message)
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

interface jwtPayload {
    emailUsername: string,
    number:number
}
export const userAuthorization = async (req:Request, res:Response)=>{
    try {
        const userToken = req.headers.authorization?.split(" ")
        // console.log(user[1])
        if (userToken) {
            const verifyToken = jwt.verify(`${userToken[1]}`, `${process.env.JWTTOKEN}`) as jwtPayload
           
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

            const userDetails = await pool.query(`SELECT username, email, img_url FROM user_info WHERE ${searchRoute} = $1`, [searchId])
     
            res.status(200).send({userDetails:userDetails.rows[0], status:true})
            // const { JwtPayload } = verifyToken;

        }

    
 } catch (error:any) {
        console.log(error.message)
         res.status(404).send({message:"Authentication failed", status:false})
 }

}