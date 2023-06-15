import { pool } from "../db"
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
