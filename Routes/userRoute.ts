import express  from "express"

export const userRoute = express.Router()
import {
    signupC,
    signinC,
    userAuthorization
} from "../Controller/userController"

userRoute.post("/signup", signupC)
userRoute.post("/signin", signinC)
userRoute.get("/authorizeuser", userAuthorization)









