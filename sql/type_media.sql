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
-- Structure de la table `type_media`
--

DROP TABLE IF EXISTS `type_media`;
CREATE TABLE IF NOT EXISTS `type_media` (
  `id_type_media` int NOT NULL AUTO_INCREMENT,
  `nom_ar_type_media` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_fr_type_media` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_cat_etat` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_type_media`),
  KEY `type_media_id_cat_etat_foreign` (`id_cat_etat`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `type_media`
--

INSERT INTO `type_media` (`id_type_media`, `nom_ar_type_media`, `nom_fr_type_media`, `id_cat_etat`, `created_at`, `updated_at`) VALUES
(1, 'تلفزيون', 'TV', 1, '2025-08-06 11:41:03', '2025-08-06 11:41:03'),
(2, 'راديو', 'Radio', 1, '2025-08-06 11:41:03', '2025-08-06 11:41:03'),
(3, 'مكتوب', 'Écrit', 2, '2025-08-06 11:41:03', '2025-08-06 11:41:03'),
(4, 'إلكتروني', 'Électronique', 2, '2025-08-06 11:41:03', '2025-08-06 11:41:03'),
(5, 'خاص', 'Privé', 3, '2025-08-06 11:41:03', '2025-08-06 11:41:03');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `type_media`
--
ALTER TABLE `type_media`
  ADD CONSTRAINT `type_media_id_cat_etat_foreign` FOREIGN KEY (`id_cat_etat`) REFERENCES `categorie_etat` (`id_cat_etat`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
