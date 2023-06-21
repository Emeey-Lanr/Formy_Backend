import{ Express } from "express"
import { userRoute } from "./userRoute"
import { formRoute } from "./formRoute"
import { registerRoute } from "./register"

export const routes = (app:Express) => {
  app.use("/user", userRoute)
    app.use("/form", formRoute)
    app.use("/register", registerRoute)
}