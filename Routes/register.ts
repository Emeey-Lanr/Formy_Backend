import express from "express"
export const registerRoute = express.Router()
import {getForm} from "../Controller/register"

registerRoute.get("/fill", getForm)


