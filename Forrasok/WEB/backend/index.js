import express from "express";
import mysql2 from "mysql2";
import dotenv from "dotenv";
dotenv.config();



const app = express();
const port = 3000;

app.use(express.json());

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

app.get("/rock",  (req, res) => {
    try {
        pool.query("SELECT * FROM stilusok", (err, results) => {
            if(err) console.log(err);
            else res.send(results);
        });
    }catch (error) {
        res.status(500).json({hiba: error.message});
    }
});

app.get("/", (req, res) =>{
    res.send("Hello word");
})


app.listen(port, () => {
    console.log(`Fut a szerver http://localhost:${port}`)
})

