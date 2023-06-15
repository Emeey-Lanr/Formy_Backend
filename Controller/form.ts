import { checkIfFormExist } from "../Validator/form.validator";
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
            console.log(link)
            const formQueryDetails = [userId,form_title, form_description, JSON.stringify(form_details), link, form_time, form_date ]
            let addForm = await pool.query("INSERT INTO form(userId,form_title, form_description, form_details, form_link, form_time, form_date) VALUES($1,$2,$3,$4,$5,$6,$7)", formQueryDetails) 
            sucessResponse(res, 202, true, "form created succesfully", addForm.rows)
         }
    } catch (error:any) {
       errorResponse(res,404,false, `${error.message}`)
    }
}


