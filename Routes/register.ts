import express from "express"
export const registerRoute = express.Router()
import {getForm, submitForm,deleteForm } from "../Controller/register"

registerRoute.get("/fill", getForm)
registerRoute.post("/submit", submitForm)
registerRoute.delete("/delete/:id", deleteForm)


