import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2';

const app = express();
const PORT = 3000;

app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.get('/berletek', (req, res) => {
    const sql = `SELECT berletek.id, berletek.megnevezes, berletek.ar, berletek.ervenyesseg_nap, berletek.elerheto, tipusok.nev FROM berletek inner JOIN tipusok ON berletek.tipus_id = tipusok.id ORDER BY berletek.ar ASC`;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json(results);
    });
});

app.get('/berletek/elerheto', (req, res) => {
    const sql = `SELECT * FROM berletek WHERE elerheto = 1 AND ervenyesseg_nap <= 30`;
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json(results);
    });
});

app.get('/berletek/kereses/:szoveg', (req, res) => {
    const keresettSzoveg = `%${req.params.szoveg}%`;
    const sql = `SELECT * FROM berletek WHERE megnevezes LIKE ? `;

    db.query(sql, [keresettSzoveg], (err, results) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json(results);
    });
});

app.get('/tipusok/statisztika', (req, res) => {
    const sql = `SELECT t.nev AS tipus_nev, COUNT(b.id) AS berletek_szama, ROUND(AVG(b.ar), 1) AS atlagos_ar FROM tipusok t INNER JOIN berletek b ON t.id = b.tipus_id GROUP BY t.id, t.nev
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json(results);
    });
});

app.get('/berletek/dragak', (req, res) => {
    const sql = `SELECT megnevezes, ar, ervenyesseg_nap FROM berletek WHERE ar > 20000 ORDER BY ervenyesseg_nap DESC`;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ hiba: err.message });
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`A szerver fut a http://localhost:${PORT}`);
});