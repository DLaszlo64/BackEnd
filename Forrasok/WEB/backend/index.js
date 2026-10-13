import express from "express";
import mysql2 from "mysql2";
import dotenv from "dotenv";
import cors from "cors"
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

app.get("/api/zenekar",  (req, res) => {
    try {
        pool.query("SELECT * FROM zenekarok", (err, results) => {
            if(err) console.log(err);
            else res.send(results);
        });
    }catch (error) {
        res.status(500).json({hiba: error.message});
    }
});

app.post("/api/ujzenekar", (req, res) => {
    try{
        pool.query("insert int zenekarok(id, nev, stilus_id, orszag, varos, aktiv_evek, tagok, legsikeresebb_album, kep_url) VALUES(id:7)",(err,results) =>{
            if (err) {
                console.log(err);
            }else{
                res.send(results)
            }
        })
    }catch(error) {
        res.status(400).json({hiba: error.message});
    }
})

app.get("/api/stilus", (req, res) => {
    try {
        pool.query("SELECT stilus_neve FROM stilusok", (err, results) =>{
            if(err) console.log(err);
            else res.send(results);
        });
    } catch (error) {
        res.status(500).json({hiba: error.message})
    }
})

app.get("/", (req, res) =>{
    res.send("Hello word");
})


app.listen(port, () => {
    console.log(`Fut a szerver http://localhost:${port}`)
})

