import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2';
import dotenv from "dotenv"

dotenv.config()

const app = express();
const PORT = 3307;


app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

app.get('/berletek',  (req, res) => {
    try {
        const sql = `SELECT berletek.id, berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap AS ervenyes_napok, berletek.elerheto AS diak_kedvezmeny, tipusok.nev AS tipus_nev FROM berletek INNER JOIN tipusok ON berletek.tipus_id = tipusok.id ORDER BY berletek.ar ASC;`;
        const [rows] =  pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});


app.get('/berletek/elerheto',  (req, res) => {
    try {
        const sql = `SELECT id, tipus_id, megnevezes, ar, ervenyesseg_nap AS ervenyes_napok, elerheto AS diak_kedvezmeny FROM berletek WHERE elerheto = 1 AND ervenyesseg_nap <= 30;`;
        const [rows] =  pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});


app.get('/berletek/kereses/:szoveg',  (req, res) => {
    try {
        const keresettSzoveg = `%${req.params.szoveg}%`;
        const sql = `SELECT id, tipus_id, megnevezes, ar, ervenyesseg_nap AS ervenyes_napok, elerheto AS diak_kedvezmeny FROM berletek WHERE megnevezes LIKE ?;`;
        const [rows] =  pool.query(sql, [keresettSzoveg]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});


app.get('/tipusok/statisztika',  (req, res) => {
    try {
        const sql = `SELECT tipusok.nev AS tipus_nev, COUNT(berletek.id) AS berletek_szama, ROUND(AVG(berletek.ar), 1) AS atlagos_ar FROM tipusok LEFT JOIN berletek ON tipusok.id = berletek.tipus_id GROUP BY tipusok.id, tipusok.nev;`;
        const [rows] =  pool.query(sql);
        res.status(200).json(formazottEredmeny);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});

app.get('/berletek/dragak',  (req, res) => {
    try {
        const sql = `SELECT megnevezes, ar, ervenyesseg_nap AS ervenyes_napok FROM berletek WHERE ar > 20000 ORDER BY ervenyesseg_nap DESC;`;
        const [rows] =  pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ hiba: error.message });
    }
});

// Szerver indítása
app.listen(PORT, () => {
    console.log(`A szerver fut a http://localhost:${PORT} címen`);
});