
import { Response } from "express"
export const errorResponse = (res:Response, statusCode:number, sucess:boolean, message:string,) => {
    res.status(statusCode).json({
        sucess: sucess,
        message: message,
      
    })
}


export const sucessResponse = (res:Response, statusCode:number, sucess:boolean, message:string, data?:any ) => {
    res.status(statusCode).json({
        sucess: sucess,
        message: message,
        data:data
    })
}