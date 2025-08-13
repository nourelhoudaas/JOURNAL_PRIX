-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mer. 13 août 2025 à 09:35
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
-- Structure de la table `categorie_etat`
--

DROP TABLE IF EXISTS `categorie_etat`;
CREATE TABLE IF NOT EXISTS `categorie_etat` (
  `id_cat_etat` int NOT NULL AUTO_INCREMENT,
  `nom_ar_etat` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_fr_etat` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_sect` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_cat_etat`),
  KEY `categorie_etat_id_sect_foreign` (`id_sect`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `categorie_etat`
--

INSERT INTO `categorie_etat` (`id_cat_etat`, `nom_ar_etat`, `nom_fr_etat`, `id_sect`, `created_at`, `updated_at`) VALUES
(1, 'وسائط صوتية', 'Média audio', 2, NULL, NULL),
(2, 'وسائط مكتوبة و إلكترونية', 'Média écrit et électronique', 2, NULL, NULL),
(3, 'خاص', 'Privé', 1, NULL, NULL);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `categorie_etat`
--
ALTER TABLE `categorie_etat`
  ADD CONSTRAINT `categorie_etat_id_sect_foreign` FOREIGN KEY (`id_sect`) REFERENCES `secteur_travail` (`id_sect`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
