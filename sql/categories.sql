-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 21 août 2025 à 10:45
-- Version du serveur : 8.2.0
-- Version de PHP : 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `prixjournaliste`
--

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id_categorie` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_categorie_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_categorie_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description_cat_ar` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description_cat_fr` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `nbr_max_oeuvre` int NOT NULL,
  PRIMARY KEY (`id_categorie`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categories`
--

INSERT INTO `categories` (`id_categorie`, `nom_categorie_ar`, `nom_categorie_fr`, `description_cat_ar`, `description_cat_fr`, `nbr_max_oeuvre`) VALUES
(1, 'الصحافة المكتوبة', 'Presse écrite', 'مقال تحليلي، تحقيق، أو روبورتاج في الصحافة المكتوبة', 'Article de fond, enquête ou reportage dans la presse écrite', 1),
(2, 'الإعلام التلفزيوني', 'Information télévisuelle', 'روبورتاج، تحقيق أو وثائقي تلفزيوني', 'Reportage, enquête ou documentaire télévisé', 1),
(3, 'الإعلام الإذاعي', 'Information radiophonique', 'روبورتاج أو تحقيق إذاعي', 'Reportage ou enquête radiophonique', 1),
(4, 'الصحافة الإلكترونية', 'Presse électronique', 'عمل إعلامي منشور على الإنترنت', 'Œuvre d’information diffusée sur le net', 1),
(5, 'الرسومات التوضيحية', 'Illustration', 'صورة، رسم أو كاريكاتير صحفي', 'Photographie, dessin ou caricature de presse', 10);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
