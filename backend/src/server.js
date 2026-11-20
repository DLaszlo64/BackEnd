const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// Segédfüggvény az útvonalban kapott ID ellenőrzéséhez.
function ervenyesId(id) {
  return Number.isInteger(Number(id)) && Number(id) > 0;
}

// -----------------------------------------------------------------------------
// A PDF-ben szereplő 5 kötelező GET végpont
// -----------------------------------------------------------------------------

// 1. GET /szolgaltatasok
// Minden szolgáltatás, kategórianévvel, alapár szerint növekvően.
app.get("/szolgaltatasok", async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        s.id,
        s.megnevezes,
        s.alapar,
        s.munkaido_perc,
        s.aktiv,
        k.nev AS kategoria_nev
      FROM szolgaltatasok s
      INNER JOIN kategoriak k ON s.kategoria_id = k.id
      ORDER BY s.alapar ASC
    `);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// 2. GET /szolgaltatasok/elerheto
// Csak aktív, legfeljebb 60 perc munkaidejű szolgáltatások.
app.get("/szolgaltatasok/elerheto", async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM szolgaltatasok
      WHERE aktiv = 1
        AND munkaido_perc <= 60
      ORDER BY alapar ASC
    `);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// 3. GET /szolgaltatasok/kereses/:szoveg
// Részletkeresés a szolgáltatás megnevezésében.
app.get("/szolgaltatasok/kereses/:szoveg", async (req, res, next) => {
  try {
    const keresettSzoveg = `%${req.params.szoveg}%`;

    const [rows] = await pool.execute(`
      SELECT *
      FROM szolgaltatasok
      WHERE megnevezes LIKE ?
      ORDER BY megnevezes ASC
    `, [keresettSzoveg]);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// 4. GET /kategoriak/statisztika
// Kategóriánként szolgáltatásszám és kerekített átlagos alapár.
app.get("/kategoriak/statisztika", async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        k.nev AS kategoria_nev,
        COUNT(s.id) AS szolgaltatasok_szama,
        ROUND(AVG(s.alapar), 1) AS atlagos_alapar
      FROM kategoriak k
      LEFT JOIN szolgaltatasok s ON s.kategoria_id = k.id
      GROUP BY k.id, k.nev
      ORDER BY k.id ASC
    `);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// 5. GET /szolgaltatasok/dragak
// 25 000 Ft feletti szolgáltatások, munkaidő szerint csökkenően.
app.get("/szolgaltatasok/dragak", async (req, res, next) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        megnevezes,
        alapar,
        munkaido_perc
      FROM szolgaltatasok
      WHERE alapar > ?
      ORDER BY munkaido_perc DESC
    `, [25000]);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------------------------------
// CRUD minta a szolgaltatasok táblán
// -----------------------------------------------------------------------------

// READ: GET /szolgaltatasok/:id
// Egy szolgáltatás lekérdezése azonosító alapján.
app.get("/szolgaltatasok/:id", async (req, res, next) => {
  try {
    if (!ervenyesId(req.params.id)) {
      return res.status(400).json({ hiba: "Érvénytelen azonosító" });
    }

    const [rows] = await pool.execute(
      "SELECT * FROM szolgaltatasok WHERE id = ?",
      [Number(req.params.id)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ hiba: "A szolgáltatás nem található" });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// CREATE: POST /szolgaltatasok
// Példa Body / raw / JSON:
// {
//   "kategoria_id": 1,
//   "megnevezes": "Próba fékellenőrzés",
//   "alapar": 12000,
//   "munkaido_perc": 30,
//   "aktiv": 1
// }
app.post("/szolgaltatasok", async (req, res, next) => {
  try {
    const {
      kategoria_id,
      megnevezes,
      alapar,
      munkaido_perc,
      aktiv
    } = req.body || {};

    if (
      kategoria_id === undefined ||
      !megnevezes ||
      alapar === undefined ||
      munkaido_perc === undefined ||
      aktiv === undefined
    ) {
      return res.status(400).json({
        hiba: "Minden mező megadása kötelező"
      });
    }

    const [result] = await pool.execute(`
      INSERT INTO szolgaltatasok
        (kategoria_id, megnevezes, alapar, munkaido_perc, aktiv)
      VALUES (?, ?, ?, ?, ?)
    `, [kategoria_id, megnevezes, alapar, munkaido_perc, aktiv]);

    res.status(201).json({
      uzenet: "A szolgáltatás létrehozása sikeres",
      id: result.insertId
    });
  } catch (err) {
    next(err);
  }
});

// UPDATE: PUT /szolgaltatasok/:id
// A PUT a teljes rekord módosítását végzi.
app.put("/szolgaltatasok/:id", async (req, res, next) => {
  try {
    if (!ervenyesId(req.params.id)) {
      return res.status(400).json({ hiba: "Érvénytelen azonosító" });
    }

    const {
      kategoria_id,
      megnevezes,
      alapar,
      munkaido_perc,
      aktiv
    } = req.body || {};

    if (
      kategoria_id === undefined ||
      megnevezes === undefined ||
      alapar === undefined ||
      munkaido_perc === undefined ||
      aktiv === undefined
    ) {
      return res.status(400).json({
        hiba: "A módosításhoz minden mező megadása szükséges"
      });
    }

    const [result] = await pool.execute(`
      UPDATE szolgaltatasok
      SET kategoria_id = ?,
          megnevezes = ?,
          alapar = ?,
          munkaido_perc = ?,
          aktiv = ?
      WHERE id = ?
    `, [
      kategoria_id,
      megnevezes,
      alapar,
      munkaido_perc,
      aktiv,
      Number(req.params.id)
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ hiba: "A szolgáltatás nem található" });
    }

    res.json({ uzenet: "A szolgáltatás módosítása sikeres" });
  } catch (err) {
    next(err);
  }
});

// DELETE: DELETE /szolgaltatasok/:id
app.delete("/szolgaltatasok/:id", async (req, res, next) => {
  try {
    if (!ervenyesId(req.params.id)) {
      return res.status(400).json({ hiba: "Érvénytelen azonosító" });
    }

    const [result] = await pool.execute(
      "DELETE FROM szolgaltatasok WHERE id = ?",
      [Number(req.params.id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ hiba: "A szolgáltatás nem található" });
    }

    res.json({ uzenet: "A szolgáltatás törlése sikeres" });
  } catch (err) {
    next(err);
  }
});

// Nem létező útvonal: egységes JSON válasz.
app.use((req, res) => {
  res.status(404).json({ hiba: "Nincs ilyen végpont" });
});

// Központi hibakezelés.
// Váratlan szerver/adatbázis hiba esetén 500-as JSON választ küld.
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    hiba: "Szerverhiba: " + err.message
  });
});

const PORT = Number(process.env.PORT) || 3000;

// A szerver akkor is elindul, ha az adatbázis átmenetileg nem érhető el.
// Az egyes végpontok az adatbázishibát 500-as JSON válasszal kezelik.
app.listen(PORT, () => {
  console.log(`A szerver fut: http://localhost:${PORT}`);

  pool.query("SELECT 1")
    .then(() => console.log("MySQL-kapcsolat sikeres."))
    .catch((err) => {
      console.error("A MySQL jelenleg nem érhető el:", err.message);
    });
});