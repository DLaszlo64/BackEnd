const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
const app = express();
app.use(express.json());
const PORT = 3000;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: "",
    port: process.env.DB_PORT
})

app.get("/diakok",  (req, res) => {
    try {
        pool.query("SELECT * FROM diak", (err, results) => {
            if(err) console.log(err);
            else res.send(results);
        });
    }catch (error) {
        res.status(500).json({hiba: error.message});
    }
});


//////////

app.get('/', (req, res) => {
    res.send('Hello from Express!');
  });

app.get("/teszt", (req, res) =>{
    res.send("Teszteles");
});


app.listen(PORT, ()=> {
    console.log(`Server running at http://localhost:${PORT}`);
});

