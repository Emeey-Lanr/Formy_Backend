import { checkIfFormExist, getformValidator } from "../Validator/form.validator";
import { Request, Response } from "express";
import { errorResponse, sucessResponse } from "../Response/response";
import { pool } from "../db";
import {v4 as uuidv4} from  "uuid" 
export const addForm = async (req: Request, res: Response) => {
    const {userId, form_title, form_description, form_details, form_time, form_date } = req.body
    try {
        
        let check = await checkIfFormExist(userId,form_title)
        if (check) {
         errorResponse(res, 404, false, "form title exist in your collection")
        } else {
            const link = uuidv4()

            const formQueryDetails = [userId,form_title, form_description, JSON.stringify(form_details), link, form_time, form_date ]
            let addForm = await pool.query("INSERT INTO form(userId,form_title, form_description, form_details, form_link, form_time, form_date) VALUES($1,$2,$3,$4,$5,$6,$7)", formQueryDetails) 
            sucessResponse(res, 200, true, "form created succesfully", addForm.rows)
         }
    } catch (error:any) {
       errorResponse(res,404,false, `${error.message}`)
    }
}

export const getFormLink = async (req: Request, res: Response) => {
   try {
       const details = await getformValidator(req)
       sucessResponse(res,  200, true, "seen succesfully", details)
   } catch (error) {
          errorResponse(res, 400,false, "Authentication failed" )
   }


}

export const deleteForm = async (req: Request, res: Response) => {
    try {

      const deleteFormQuery = await pool.query("DELETE FROM form WHERE  form_link = $1", [req.params.id])
        const deleteRegistration = await pool.query("DELETE FROM register WHERE form_link = $1", [req.params.id])
        
        sucessResponse(res, 200, true, "deleted succesfully", [])
    } catch (error: any) {
      
         errorResponse(res, 404, false, error.message)
    }
    
}


export const formRegistrationDetails = async (req: Request, res: Response) => {
    try {
        const form_link = req.headers.authorization?.split(" ")[1]
       
        const formLink = await pool.query("SELECT form_title, form_link, form_description FROM form WHERE form_link = $1", [form_link])

        
        if (formLink.rows.length > 0) {
            const user = await pool.query("SELECT * FROM register WHERE form_link = $1", [form_link])
            sucessResponse(res, 200, true, "Valid access link", { details: formLink.rows[0], data: user.rows })
        }else{
           errorResponse(res, 404, false, "Invalid access link")
        }

    } catch (error) {
        errorResponse(res, 500, false, 'Internal Server Error')
    }
}