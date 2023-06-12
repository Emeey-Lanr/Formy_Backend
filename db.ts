import postgres from "pg"
import dotenv from "dotenv"
dotenv.config()

const pg = postgres.Pool

export const pool = new pg({
    user: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASS}`,
    host: `${process.env.DB_HOST}`,
    port:Number(process.env.DB_PORT),
    database:`${process.env.DB_CONNECTED_DB}`,
    
})




