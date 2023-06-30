import { Request, Response } from "express"
import { pool } from "../db"
import { sucessResponse } from "../Response/response"
import { errorResponse } from "../Response/response"
import { fillFormV, submitFormV } from "../Validator/register.Validator"

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

export const submitForm = async (req: Request, res: Response) => {
    // Don't forget to work on the form extra details
    const submit = await submitFormV (req.body)
    if (submit instanceof Error) {
         errorResponse(res, 401, false, submit.message)
    } else {
        sucessResponse(res, 200, true, "submitted succesfully", submit.rows)
    }
    
      
}


export const deleteForm = async (req:Request, res:Response) => {
    try {
        console.log(req.params.id)
        const deleteForm = await pool.query("DELETE FROM register WHERE id = $1", [Number(req.params.id)])
        sucessResponse(res, 200, true, "Deleted Successfully")
    } catch (error:any) {
        errorResponse(res, 500, false, `${error.message}`, )
    }
}