import express  from "express"

 const route = express.Router()
import { signupC,signinC} from "../Controller/userController"
route.post("/signup", signupC)
route.post("/signin", signinC)




module.exports = route





