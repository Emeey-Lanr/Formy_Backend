import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import { formRoute } from "./Routes/formRoute"
import { userRoute } from "./Routes/userRoute"

import cors from "cors"

dotenv.config()

// const userRoute = require("./Routes/userRoute")



const app:Express = express()


app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
const PORT = process.env.PORT
app.use("/user", userRoute)
app.use("/form", formRoute)







app.listen(PORT,() => {
    console.log(`app has started at port ${PORT}`)
})

