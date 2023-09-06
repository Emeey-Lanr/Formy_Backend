import express  from "express"

export const userRoute = express.Router()
import {
    signupC,
    signinC,
    userAuthorization,
    uploadUserProfileImg,
    changeUserPassword,
    emailPasswordVerification,
    emailTokenVerification,
    changeForgotPassword
} from "../Controller/userController"

userRoute.post("/signup", signupC)
userRoute.post("/signin", signinC)
userRoute.get("/authorizeuser", userAuthorization)
userRoute.put("/uploadProfileImg", uploadUserProfileImg)
userRoute.put("/changepassword", changeUserPassword)
userRoute.post("/emailVerification", emailPasswordVerification)
userRoute.get("/emailTokenVerification", emailTokenVerification)
userRoute.put("/changeForgotPassword", changeForgotPassword)









