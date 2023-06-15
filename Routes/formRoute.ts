import express from "express"
import { addForm } from "../Controller/form"

export const formRoute = express.Router()
formRoute.post("/add", addForm)





