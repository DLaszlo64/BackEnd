# Szerviz REST API – C csoport

Node.js + Express + MySQL API a feltöltött, C csoportos Backend gyakorlati témazáró alapján.

## A feladat adatbázisa

A PDF szerint az adatbázis neve: `szerviz_db`.

Táblák:

### `kategoriak`

- `id`: INT, elsődleges kulcs, AUTO_INCREMENT
- `nev`: VARCHAR(50), NOT NULL, UNIQUE

Kategóriák:
- Futómű és Fék
- Motor és Erőátvitel
- Időszakos Karbantartás

### `szolgaltatasok`

- `id`: INT, elsődleges kulcs, AUTO_INCREMENT
- `kategoria_id`: INT, idegen kulcs → `kategoriak(id)`
- `megnevezes`: VARCHAR(100), NOT NULL
- `alapar`: INT, NOT NULL
- `munkaido_perc`: INT, NOT NULL
- `aktiv`: TINYINT(1), NOT NULL (1 = aktív, 0 = szüneteltetett)

## Telepítés

1. Importáld a vizsgához kapott `szerviz_db.sql` fájlt a MySQL szerverre.
2. Terminálban lépj be a projekt mappájába.
3. Telepítsd a függőségeket:

```bash
npm install
```

4. Másold le a `.env.example` fájlt `.env` néven.
5. Állítsd be a saját MySQL felhasználónevedet és jelszavadat:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=szerviz_db
DB_PORT=3306
PORT=3000
```

6. Indítsd el:

```bash
npm run dev
```

vagy:

```bash
npm start
```

Alapcím: `http://localhost:3000`

## A PDF 5 kötelező GET végpontja

| Metódus | URL | Működés |
|---|---|---|
| GET | `/szolgaltatasok` | Összes szolgáltatás kategórianévvel, alapár szerint növekvően |
| GET | `/szolgaltatasok/elerheto` | `aktiv = 1` ÉS `munkaido_perc <= 60` |
| GET | `/szolgaltatasok/kereses/csere` | Részletkeresés a megnevezésben, `LIKE` |
| GET | `/kategoriak/statisztika` | Kategóriánkénti darabszám és átlagos alapár |
| GET | `/szolgaltatasok/dragak` | `alapar > 25000`, munkaidő szerint csökkenően |

## Kiegészítő CRUD végpontok

| CRUD | Metódus | URL | SQL művelet |
|---|---|---|---|
| Create | POST | `/szolgaltatasok` | INSERT |
| Read | GET | `/szolgaltatasok/1` | SELECT |
| Update | PUT | `/szolgaltatasok/1` | UPDATE |
| Delete | DELETE | `/szolgaltatasok/1` | DELETE |

A speciális GET útvonalak a `/:id` útvonal előtt szerepelnek a kódban, így nem akadnak össze az azonosító szerinti lekérdezéssel.

## CRUD tesztelése Postmanben vagy Thunder Clientben

### 1. CREATE – új szolgáltatás

Metódus: `POST`

URL:

```text
http://localhost:3000/szolgaltatasok
```

Body → raw → JSON:

```json
{
  "kategoria_id": 1,
  "megnevezes": "Próba fékellenőrzés",
  "alapar": 12000,
  "munkaido_perc": 30,
  "aktiv": 1
}
```

Sikeres válasz (201):

```json
{
  "uzenet": "A szolgáltatás létrehozása sikeres",
  "id": 11
}
```

Az `id` értéke az adatbázisban keletkezett tényleges azonosító; a példa 11-es értéke nem garantált.

### 2. READ – egy szolgáltatás lekérdezése

Metódus: `GET`

```text
http://localhost:3000/szolgaltatasok/1
```

### 3. UPDATE – szolgáltatás módosítása

Metódus: `PUT`

```text
http://localhost:3000/szolgaltatasok/1
```

Body → raw → JSON:

```json
{
  "kategoria_id": 1,
  "megnevezes": "Módosított fékellenőrzés",
  "alapar": 13500,
  "munkaido_perc": 40,
  "aktiv": 1
}
```

A PUT teljes rekordot módosít, ezért minden mezőt meg kell adni.

### 4. DELETE – szolgáltatás törlése

Metódus: `DELETE`

```text
http://localhost:3000/szolgaltatasok/1
```

## Fontos kódrészletek tanulóknak

- `req.params.szoveg`: az URL útvonalparamétere.
- `req.params.id`: az URL-ben szereplő rekordazonosító.
- `req.body`: a POST vagy PUT kérés JSON-adattörzse.
- `INNER JOIN`: összekapcsolja a szolgáltatásokat a kategóriákkal.
- `LIKE`: részletkeresést végez.
- `COUNT()`: megszámolja a rekordokat.
- `AVG()`: átlagot számít.
- `GROUP BY`: csoportosítja az adatokat.
- `ORDER BY ... ASC`: növekvő rendezés.
- `ORDER BY ... DESC`: csökkenő rendezés.
- `?` helyőrzők: paraméterezett SQL-lekérdezések, amelyek segítenek az SQL injection elleni védelemben.
- `next(err)`: a hibát a központi hibakezelőnek adja át.

## Hibakezelés

A PDF szerint az API válaszai JSON formátumúak. Váratlan szerver- vagy adatbázishiba esetén a szerver 500-as státuszkódot és ilyen objektumot küld:

```json
{
  "hiba": "Szerverhiba: hibaüzenet"
}
```

A kódban ezen felül a hibás kliensadatok 400-as, a nem található rekordok 404-es választ kapnak.

## Megjegyzés az adatokról

A PDF 1. oldala a három kategóriát és a tíz szolgáltatásra vonatkozó elvárást mutatja, de nem tartalmazza mind a tíz rekord teljes adatsorát. Ezért a projekt a vizsgához kapott `szerviz_db.sql` importálását használja; a `database.sql` csak a táblastruktúra és a kategóriák önálló létrehozására szolgáló kiegészítő fájl, nem helyettesíti a teljes vizsga-adatbázist.
