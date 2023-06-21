import e, { Request, Response } from "express"
import { pool } from "../db"
import { sucessResponse } from "../Response/response"
import { errorResponse } from "../Response/response"
import { fillFormV } from "../Validator/register.Validator"
export const getForm = async (req: Request, res: Response) => {
 
        const link = req.headers.authorization?.split(" ")[1]
    const checkBefore = await fillFormV(`${link}`)
    if (checkBefore instanceof Error) {
   
        errorResponse(res, Number(checkBefore.message.split("/")[1]), false, checkBefore.message.split("/")[0])
    } else {
        console.log(checkBefore, "Lkjhgf")
        sucessResponse(res, 200, true, "Valid Acesss Link", checkBefore)
    }
    
    
 
      
   
  
    
}