CREATE DATABASE IF NOT EXISTS szerviz_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;

USE szerviz_db;

CREATE TABLE IF NOT EXISTS kategoriak (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS szolgaltatasok (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kategoria_id INT NOT NULL,
    megnevezes VARCHAR(100) NOT NULL,
    alapar INT NOT NULL,
    munkaido_perc INT NOT NULL,
    aktiv TINYINT(1) NOT NULL,
    CONSTRAINT fk_szolgaltatasok_kategoriak
      FOREIGN KEY (kategoria_id) REFERENCES kategoriak(id)
);

INSERT IGNORE INTO kategoriak (id, nev) VALUES
(1, 'Futómű és Fék'),
(2, 'Motor és Erőátvitel'),
(3, 'Időszakos Karbantartás');

-- Megjegyzés:
-- A vizsgához kapott szerviz_db.sql importálása esetén ezt a fájlt
-- nem szükséges használni. A feladatlap 10 szolgáltatási rekordot
-- feltételez; azokat a vizsgához kapott adatbázis tartalmazza.
-- Ez a fájl csak a PDF-ben megadott struktúra önálló létrehozására szolgál.