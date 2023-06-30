import { pool } from "../db"
import { UserValidator } from "../Validator/user"
export class UserService {
    static async getDashDetails(userEmail:string) {
        try {
            const allFormResponse = await pool.query("SELECT * FROM register WHERE owner_id = $1", [userEmail])
            const allForm = await pool.query("SELECT * FROM form WHERE userid = $1", [userEmail])
            const lastestForms = allForm.rows.filter((_, id)=> id > allForm.rows.length - 11).reverse()
            const lastestResponses = allFormResponse.rows.filter((_, id) => id > allFormResponse.rows.length - 11).reverse()
            const topThree = await UserValidator.ValidateTopThreeRanks(allFormResponse.rows)

            return {lastestForms, lastestResponses, topThree}
          
      
        } catch (error: any) {
          
            return new Error(error.message)
        }
    }
}

