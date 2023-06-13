import express  from "express"

 const route = express.Router()
import {
    signupC,
    signinC,
    userAuthorization
} from "../Controller/userController"

route.post("/signup", signupC)
route.post("/signin", signinC)
route.get("/authorizeuser", userAuthorization)




module.exports = route





