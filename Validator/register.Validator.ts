import { timeStamp } from "console"
import { pool } from "../db"
export const fillFormV = async (link:string) => {
    try {
        const date = new Date
           const lookedForForm = await pool.query("SELECT form_title, form_description, form_details, form_time,  form_date FROM form WHERE form_link = $1", [link])
        if (lookedForForm.rows.length === 0) {
           return new Error("Invalid Acess Link/404")
        } 
        const todayDate = date.getFullYear() + (date.getMonth() + 1) + date.getDate()
        const todayTime = date.getHours() + date.getMinutes()
      
     
        let ifDateIsNotEmpty = lookedForForm.rows[0].form_date !== ""
       
      const setTime =  lookedForForm.rows[0].form_time.split(":") 
     const addSetTime = Number(setTime[0]) + Number(setTime[1])
     const expiringDate =  Number(lookedForForm.rows[0].form_date.split("-")[0]) + Number(lookedForForm.rows[0].form_date.split("-")[1]) + Number(lookedForForm.rows[0].form_date.split("-")[2])
      
        const returnErrorData = (data:any) => {
             return   data
        }
      

        if (ifDateIsNotEmpty && lookedForForm.rows[0].form_time !== "") {
            if (todayDate <= expiringDate && todayTime <= addSetTime) {
               return  returnErrorData(lookedForForm.rows[0])
               
            } else {
                  return  returnErrorData(new Error("Form has expired/404"))
            
            }
         
       
        } else if (ifDateIsNotEmpty && lookedForForm.rows[0].form_time === "") {
              if (todayDate <= expiringDate) {
        
          return  returnErrorData(lookedForForm.rows[0])
              } else {
                 return  returnErrorData(new Error("Form has expired/404"))
            }
        } else {
          return  returnErrorData(lookedForForm.rows[0])
        }
        
          
        
    } catch (error: any) {
        console.log(error)
        return new Error(`Internal Error/500`)
    }
        
}