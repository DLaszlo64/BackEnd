import express, { json } from "express"
import mysql2 from "mysql2"
import dotenv from "dotenv"
dotenv.config()
const PORT = 3000

const app = express()

app.use(express.json());

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    port: process.env.DB_PORT,
    database : process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
})


app.get("/", (req,res) => {
    try{
        pool.query("SELECT * from stilusok", (err, ressult) =>{
            if(err) console.log(err)
            else res.send(ressult)
        })
    }catch(error){
        res.status(500).json({hiba: error.message})
    }
})


app.listen(PORT, () =>{
    console.log(`Server running at http://localhost:${PORT}`)
})