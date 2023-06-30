import express from "express"
import { addForm,getFormLink, deleteForm , formRegistrationDetails} from "../Controller/form"

export const formRoute = express.Router()
formRoute.post("/add", addForm)
formRoute.get("/getlink", getFormLink)
formRoute.delete("/delete/:id", deleteForm)
formRoute.get("/formRegistrationDetails", formRegistrationDetails)





