import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import { routes } from "./Routes/routes"

import cors from "cors"

dotenv.config()

// const userRoute = require("./Routes/userRoute")



const app:Express = express()


app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(express.json())
routes(app)
const PORT = process.env.PORT








app.listen(PORT,() => {
    console.log(`app has started at port ${PORT}`)
})

