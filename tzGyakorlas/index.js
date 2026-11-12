import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const PORT = 3000;

app.use(express.json());

// Adatbázis kapcsolat (Connection Pool)
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'szerviz_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 1. VÉGPONT: GET /szolgaltatasok
app.get('/szolgaltatasok', async (req, res) => {
    try {
        const sql = `
            SELECT 
                s.id, 
                s.megnevezes, 
                s.alapar, 
                s.munkaido_perc, 
                s.aktiv, 
                k.nev AS kategoria_nev
            FROM szolgaltatasok s
            JOIN kategoriak k ON s.kategoria_id = k.id
            ORDER BY s.alapar ASC
        `;
        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Hiba a /szolgaltatasok végponton:', error);
        res.status(500).json({ hiba: 'Szerverhiba történt a szolgáltatások lekérdezése során.' });
    }
});

// 2. VÉGPONT: GET /szolgaltatasok/elerheto
app.get('/szolgaltatasok/elerheto', async (req, res) => {
    try {
        const sql = `
            SELECT 
                id, 
                kategoria_id, 
                megnevezes, 
                alapar, 
                munkaido_perc, 
                aktiv
            FROM szolgaltatasok
            WHERE aktiv = 1 AND munkaido_perc <= 60
        `;
        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Hiba a /szolgaltatasok/elerheto végponton:', error);
        res.status(500).json({ hiba: 'Szerverhiba történt az elérhető szolgáltatások lekérdezése során.' });
    }
});

// 3. VÉGPONT: GET /szolgaltatasok/kereses/:szoveg
app.get('/szolgaltatasok/kereses/:szoveg', async (req, res) => {
    try {
        const keresettSzoveg = `%${req.params.szoveg}%`;
        const sql = `
            SELECT 
                id, 
                kategoria_id, 
                megnevezes, 
                alapar, 
                munkaido_perc, 
                aktiv
            FROM szolgaltatasok
            WHERE megnevezes LIKE ?
        `;
        const [rows] = await pool.query(sql, [keresettSzoveg]);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Hiba a /szolgaltatasok/kereses végponton:', error);
        res.status(500).json({ hiba: 'Szerverhiba történt a keresés során.' });
    }
});

// 4. VÉGPONT: GET /kategoriak/statisztika
app.get('/kategoriak/statisztika', async (req, res) => {
    try {
        const sql = `
            SELECT 
                k.nev AS kategoria_nev,
                COUNT(s.id) AS szolgaltatasok_szama,
                ROUND(AVG(s.alapar), 1) AS atlagos_alapar
            FROM kategoriak k
            LEFT JOIN szolgaltatasok s ON k.id = s.kategoria_id
            GROUP BY k.id, k.nev
        `;
        const [rows] = await pool.query(sql);
        
        const formazottSorok = rows.map(row => ({
            kategoria_nev: row.kategoria_nev,
            szolgaltatasok_szama: Number(row.szolgaltatasok_szama),
            atlagos_alapar: row.atlagos_alapar !== null ? Number(row.atlagos_alapar) : 0
        }));

        res.status(200).json(formazottSorok);
    } catch (error) {
        console.error('Hiba a /kategoriak/statisztika végponton:', error);
        res.status(500).json({ hiba: 'Szerverhiba történt a statisztikák lekérdezése során.' });
    }
});

// 5. VÉGPONT: GET /szolgaltatasok/dragak
app.get('/szolgaltatasok/dragak', async (req, res) => {
    try {
        const sql = `
            SELECT 
                megnevezes, 
                alapar, 
                munkaido_perc
            FROM szolgaltatasok
            WHERE alapar > 25000
            ORDER BY munkaido_perc DESC
        `;
        const [rows] = await pool.query(sql);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Hiba a /szolgaltatasok/dragak végponton:', error);
        res.status(500).json({ hiba: 'Szerverhiba történt a drága szolgáltatások lekérdezése során.' });
    }
});

// Nem létező útvonalak kezelése
app.use((req, res) => {
    res.status(404).json({ hiba: 'A keresett végpont nem található.' });
});

// Szerver indítása
app.listen(PORT, () => {
    console.log(`A szerver fut a http://localhost:${PORT} címen.`);
});