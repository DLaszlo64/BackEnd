-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1:3307
-- Létrehozás ideje: 2026. Okt 01. 11:27
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `diaknyilvantartas`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `diak`
--

CREATE TABLE `diak` (
  `id` int(11) NOT NULL,
  `lakcimID` int(11) DEFAULT NULL,
  `vezetekNev` varchar(40) DEFAULT NULL,
  `kereszteNev` varchar(40) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `diak`
--

INSERT INTO `diak` (`id`, `lakcimID`, `vezetekNev`, `kereszteNev`, `email`) VALUES
(1, 1, 'Kovács', 'Péter', 'kovacs.peter@email.hu'),
(2, 2, 'Nagy', 'Anna', 'nagy.anna@email.hu'),
(3, 3, 'Szabó', 'Máté', 'szabo.mate@email.hu'),
(4, 4, 'Tóth', 'Boglárka', 'toth.boglarka@email.hu');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `lakcim`
--

CREATE TABLE `lakcim` (
  `id` int(11) NOT NULL,
  `utca` varchar(40) DEFAULT NULL,
  `varos` varchar(30) DEFAULT NULL,
  `megye` varchar(50) DEFAULT NULL,
  `iranyitoszam` int(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `lakcim`
--

INSERT INTO `lakcim` (`id`, `utca`, `varos`, `megye`, `iranyitoszam`) VALUES
(1, 'Fő utca 12.', 'Budapest', 'Pest', 1051),
(2, 'Petőfi Sándor utca 5.', 'Szeged', 'Csongrád-Csanád', 6720),
(3, 'Kossuth Lajos út 42.', 'Debrecen', 'Hajdú-Bihar', 4024),
(4, 'Rákóczi út 8.', 'Győr', 'Győr-Moson-Sopron', 9021);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `osztaly`
--

CREATE TABLE `osztaly` (
  `id` int(11) NOT NULL,
  `diakID` int(11) DEFAULT NULL,
  `osztalyNev` varchar(5) DEFAULT NULL,
  `osztalyFonok` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `osztaly`
--

INSERT INTO `osztaly` (`id`, `diakID`, `osztalyNev`, `osztalyFonok`) VALUES
(1, 1, '10.A', 'Horváth Éva'),
(2, 2, '10.A', 'Horváth Éva'),
(3, 3, '11.B', 'Kiss Ferenc'),
(4, 4, '12.C', 'Molnár Katalin');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `diak`
--
ALTER TABLE `diak`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lakcimID` (`lakcimID`);

--
-- A tábla indexei `lakcim`
--
ALTER TABLE `lakcim`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `osztaly`
--
ALTER TABLE `osztaly`
  ADD PRIMARY KEY (`id`),
  ADD KEY `diakID` (`diakID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `diak`
--
ALTER TABLE `diak`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `lakcim`
--
ALTER TABLE `lakcim`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `osztaly`
--
ALTER TABLE `osztaly`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `diak`
--
ALTER TABLE `diak`
  ADD CONSTRAINT `diak_ibfk_1` FOREIGN KEY (`lakcimID`) REFERENCES `lakcim` (`id`);

--
-- Megkötések a táblához `osztaly`
--
ALTER TABLE `osztaly`
  ADD CONSTRAINT `osztaly_ibfk_1` FOREIGN KEY (`diakID`) REFERENCES `diak` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
