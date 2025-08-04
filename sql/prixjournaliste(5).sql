-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 04 août 2025 à 19:54
-- Version du serveur : 8.0.31
-- Version de PHP : 8.2.0

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
-- Structure de la table `appartients`
--

DROP TABLE IF EXISTS `appartients`;
CREATE TABLE IF NOT EXISTS `appartients` (
  `id_appartient` int NOT NULL AUTO_INCREMENT,
  `id_edition` int NOT NULL,
  `id_theme` int NOT NULL,
  PRIMARY KEY (`id_appartient`),
  KEY `appartients_id_edition_foreign` (`id_edition`),
  KEY `appartients_id_theme_foreign` (`id_theme`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `associes`
--

DROP TABLE IF EXISTS `associes`;
CREATE TABLE IF NOT EXISTS `associes` (
  `id_associe` int NOT NULL AUTO_INCREMENT,
  `id_oeuvre` int NOT NULL,
  `id_theme` int NOT NULL,
  PRIMARY KEY (`id_associe`),
  KEY `associes_id_oeuvre_foreign` (`id_oeuvre`),
  KEY `associes_id_theme_foreign` (`id_theme`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

DROP TABLE IF EXISTS `cache`;
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id_categorie` int NOT NULL AUTO_INCREMENT,
  `nom_categorie_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_categorie_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description_cat_ar` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description_cat_fr` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `nbr_max_oeuvre` int NOT NULL,
  PRIMARY KEY (`id_categorie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `categorie_etat`
--

DROP TABLE IF EXISTS `categorie_etat`;
CREATE TABLE IF NOT EXISTS `categorie_etat` (
  `id_cat_etat` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_ar_etat` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_fr_etat` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_sect` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_cat_etat`),
  KEY `categorie_etat_id_sect_foreign` (`id_sect`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `comptes`
--

DROP TABLE IF EXISTS `comptes`;
CREATE TABLE IF NOT EXISTS `comptes` (
  `id_compte` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mot_passe_hash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verification_code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut_email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code_forget_pass_generate` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_creation_cmpt` datetime NOT NULL,
  `date_update_cmpt` datetime DEFAULT NULL,
  `date_verification_email` datetime DEFAULT NULL,
  `id` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`id_compte`),
  UNIQUE KEY `comptes_username_unique` (`username`),
  UNIQUE KEY `comptes_email_unique` (`email`),
  KEY `comptes_id_foreign` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `contients`
--

DROP TABLE IF EXISTS `contients`;
CREATE TABLE IF NOT EXISTS `contients` (
  `id_contient` int NOT NULL AUTO_INCREMENT,
  `id_oeuvre` int NOT NULL,
  `id_categorie` int NOT NULL,
  PRIMARY KEY (`id_contient`),
  KEY `contients_id_oeuvre_foreign` (`id_oeuvre`),
  KEY `contients_id_categorie_foreign` (`id_categorie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `dossiers`
--

DROP TABLE IF EXISTS `dossiers`;
CREATE TABLE IF NOT EXISTS `dossiers` (
  `id_dossier` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_create_dossier` datetime NOT NULL,
  `statut_dossier` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_dossier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `editions`
--

DROP TABLE IF EXISTS `editions`;
CREATE TABLE IF NOT EXISTS `editions` (
  `id_edition` int NOT NULL AUTO_INCREMENT,
  `annee_edition` date NOT NULL,
  `num_edition` int NOT NULL,
  `date_lancement_edition` date NOT NULL,
  `date_limite_depotDossier` date NOT NULL,
  `statut_edition` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_edition`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `equipes`
--

DROP TABLE IF EXISTS `equipes`;
CREATE TABLE IF NOT EXISTS `equipes` (
  `id_equipe` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_equipe_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_equipe_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_personne` bigint UNSIGNED NOT NULL,
  `id_oeuvre` int NOT NULL,
  PRIMARY KEY (`id_equipe`),
  KEY `equipes_id_personne_foreign` (`id_personne`),
  KEY `equipes_id_oeuvre_foreign` (`id_oeuvre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `etablissement`
--

DROP TABLE IF EXISTS `etablissement`;
CREATE TABLE IF NOT EXISTS `etablissement` (
  `id_etab` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_ar_etab` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_fr_etab` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_etab` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tel_etab` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `langue` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialite` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tv` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `radio` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `media` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_type_media` bigint UNSIGNED NOT NULL,
  `id_specialite` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_etab`),
  KEY `etablissement_id_specialite_foreign` (`id_specialite`),
  KEY `etablissement_id_type_media_foreign` (`id_type_media`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fichiers`
--

DROP TABLE IF EXISTS `fichiers`;
CREATE TABLE IF NOT EXISTS `fichiers` (
  `id_fichier` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_fichier_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_fichier_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `size` int NOT NULL,
  `date_upload` datetime NOT NULL,
  `id_dossier` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`id_fichier`),
  KEY `fichiers_id_dossier_foreign` (`id_dossier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `forme`
--

DROP TABLE IF EXISTS `forme`;
CREATE TABLE IF NOT EXISTS `forme` (
  `id_equipe` bigint UNSIGNED NOT NULL,
  `id_personne` bigint UNSIGNED NOT NULL,
  `role` enum('principal','membre') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'membre',
  `date_integration` date DEFAULT NULL,
  PRIMARY KEY (`id_equipe`,`id_personne`),
  KEY `forme_id_personne_foreign` (`id_personne`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint UNSIGNED NOT NULL,
  `reserved_at` int UNSIGNED DEFAULT NULL,
  `available_at` int UNSIGNED NOT NULL,
  `created_at` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `juries`
--

DROP TABLE IF EXISTS `juries`;
CREATE TABLE IF NOT EXISTS `juries` (
  `id_jury` int NOT NULL AUTO_INCREMENT,
  `date_debut_mondat` date NOT NULL,
  `date_fin_mondat` date NOT NULL,
  PRIMARY KEY (`id_jury`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_07_07_093622_add_two_factor_columns_to_users_table', 1),
(5, '2025_07_09_103344_create_comptes_table', 1),
(6, '2025_07_09_103356_create_dossiers_table', 1),
(7, '2025_07_09_103358_create_personnes_table', 1),
(8, '2025_07_09_103438_create_participants_table', 1),
(9, '2025_07_09_103457_create_juries_table', 1),
(10, '2025_07_09_103534_create_peut-etre-participants_table', 1),
(11, '2025_07_09_103541_create_peut-etre-juries_table', 1),
(12, '2025_07_09_103606_create_editions_table', 1),
(13, '2025_07_09_103618_create_themes_table', 1),
(14, '2025_07_09_103633_create_appartients_table', 1),
(15, '2025_07_09_103648_create_categories_table', 1),
(16, '2025_07_09_103713_create_fichiers_table', 1),
(17, '2025_07_09_103714_create_travails_table', 1),
(18, '2025_07_09_103728_create_equipes_table', 1),
(19, '2025_07_09_103736_create_contients_table', 1),
(20, '2025_07_09_103812_create_associes_table', 1),
(21, '2025_07_09_135949_add_verification_code_to_users_table', 1),
(22, '2025_07_14_091229_create_personal_access_tokens_table', 1),
(23, '2025_07_23_091455_create_secteur_travails_table', 1),
(24, '2025_07_23_091502_create_categorie_etats_table', 1),
(25, '2025_07_23_091508_create_type_media_table', 1),
(26, '2025_07_23_091513_create_specialite_table', 1),
(27, '2025_07_23_091514_create_etablissements_table', 1),
(28, '2025_07_24_095732_create_forme_table', 1),
(29, '2025_08_03_110246_create_wilayas_table', 1),
(30, '2025_08_04_143141_create_occuper_table', 1);

-- --------------------------------------------------------

--
-- Structure de la table `occuper`
--

DROP TABLE IF EXISTS `occuper`;
CREATE TABLE IF NOT EXISTS `occuper` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `date_recrut` date NOT NULL,
  `num_attes` bigint UNSIGNED NOT NULL,
  `id_etab` bigint UNSIGNED NOT NULL,
  `id_personne` bigint UNSIGNED NOT NULL,
  `id_fichier` bigint UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `occuper_num_attes_unique` (`num_attes`),
  KEY `occuper_id_etab_foreign` (`id_etab`),
  KEY `occuper_id_personne_foreign` (`id_personne`),
  KEY `occuper_id_fichier_foreign` (`id_fichier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `participants`
--

DROP TABLE IF EXISTS `participants`;
CREATE TABLE IF NOT EXISTS `participants` (
  `id_participant` int NOT NULL AUTO_INCREMENT,
  `date_debut_activité` date NOT NULL,
  PRIMARY KEY (`id_participant`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint UNSIGNED NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personnes`
--

DROP TABLE IF EXISTS `personnes`;
CREATE TABLE IF NOT EXISTS `personnes` (
  `id_personne` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_nin_personne` decimal(18,0) NOT NULL,
  `nom_personne_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_personne_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom_personne_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom_personne_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_naissance` date NOT NULL,
  `lieu_naissance_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lieu_naissance_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationalite_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nationalite_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_professional_card` int DEFAULT NULL,
  `num_tlf_personne` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `adresse_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fonction_ar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fonction_fr` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sexe_personne_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sexe_personne_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `groupage` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_compte` bigint UNSIGNED NOT NULL,
  `id_dossier` bigint UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id_personne`),
  UNIQUE KEY `personnes_id_nin_personne_unique` (`id_nin_personne`),
  UNIQUE KEY `personnes_id_dossier_unique` (`id_dossier`),
  KEY `personnes_id_compte_foreign` (`id_compte`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `peut-etre-juries`
--

DROP TABLE IF EXISTS `peut-etre-juries`;
CREATE TABLE IF NOT EXISTS `peut-etre-juries` (
  `id_peut_etre_jury` int NOT NULL AUTO_INCREMENT,
  `id_personne` bigint UNSIGNED NOT NULL,
  `id_jury` int NOT NULL,
  PRIMARY KEY (`id_peut_etre_jury`),
  KEY `peut_etre_juries_id_personne_foreign` (`id_personne`),
  KEY `peut_etre_juries_id_jury_foreign` (`id_jury`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `peut-etre-participants`
--

DROP TABLE IF EXISTS `peut-etre-participants`;
CREATE TABLE IF NOT EXISTS `peut-etre-participants` (
  `id_peut_etre_participant` int NOT NULL AUTO_INCREMENT,
  `id_personne` bigint UNSIGNED NOT NULL,
  `id_participant` int NOT NULL,
  PRIMARY KEY (`id_peut_etre_participant`),
  KEY `peut_etre_participants_id_personne_foreign` (`id_personne`),
  KEY `peut_etre_participants_id_participant_foreign` (`id_participant`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `secteur_travail`
--

DROP TABLE IF EXISTS `secteur_travail`;
CREATE TABLE IF NOT EXISTS `secteur_travail` (
  `id_sect` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_ar_sect` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_fr_sect` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_sect`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `specialite`
--

DROP TABLE IF EXISTS `specialite`;
CREATE TABLE IF NOT EXISTS `specialite` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `themes`
--

DROP TABLE IF EXISTS `themes`;
CREATE TABLE IF NOT EXISTS `themes` (
  `id_theme` int NOT NULL AUTO_INCREMENT,
  `titre_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titre_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_theme`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `travails`
--

DROP TABLE IF EXISTS `travails`;
CREATE TABLE IF NOT EXISTS `travails` (
  `id_oeuvre` int NOT NULL AUTO_INCREMENT,
  `titre_oeuvre_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titre_oeuvre_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Duree_nbr_signes` time NOT NULL,
  `date_publication` date NOT NULL,
  `description_oeuvre_ar` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `description_oeuvre_fr` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut_oeuvre_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `statut_oeuvre_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valider_oeuvre` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_creation_oeuvre` datetime NOT NULL,
  `annee_gain` date DEFAULT NULL,
  `classement` int DEFAULT NULL,
  `id_fichier` bigint UNSIGNED NOT NULL,
  PRIMARY KEY (`id_oeuvre`),
  KEY `travails_id_fichier_foreign` (`id_fichier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `type_media`
--

DROP TABLE IF EXISTS `type_media`;
CREATE TABLE IF NOT EXISTS `type_media` (
  `id_type_media` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `nom_ar_type_media` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom_fr_type_media` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_cat_etat` bigint UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_type_media`),
  KEY `type_media_id_cat_etat_foreign` (`id_cat_etat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `two_factor_secret` text COLLATE utf8mb4_unicode_ci,
  `two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `verification_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `wilayas`
--

DROP TABLE IF EXISTS `wilayas`;
CREATE TABLE IF NOT EXISTS `wilayas` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name_fr` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name_ar` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `appartients`
--
ALTER TABLE `appartients`
  ADD CONSTRAINT `appartients_id_edition_foreign` FOREIGN KEY (`id_edition`) REFERENCES `editions` (`id_edition`) ON DELETE CASCADE,
  ADD CONSTRAINT `appartients_id_theme_foreign` FOREIGN KEY (`id_theme`) REFERENCES `themes` (`id_theme`) ON DELETE CASCADE;

--
-- Contraintes pour la table `associes`
--
ALTER TABLE `associes`
  ADD CONSTRAINT `associes_id_oeuvre_foreign` FOREIGN KEY (`id_oeuvre`) REFERENCES `travails` (`id_oeuvre`) ON DELETE CASCADE,
  ADD CONSTRAINT `associes_id_theme_foreign` FOREIGN KEY (`id_theme`) REFERENCES `themes` (`id_theme`) ON DELETE CASCADE;

--
-- Contraintes pour la table `categorie_etat`
--
ALTER TABLE `categorie_etat`
  ADD CONSTRAINT `categorie_etat_id_sect_foreign` FOREIGN KEY (`id_sect`) REFERENCES `secteur_travail` (`id_sect`) ON DELETE CASCADE;

--
-- Contraintes pour la table `comptes`
--
ALTER TABLE `comptes`
  ADD CONSTRAINT `comptes_id_foreign` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `contients`
--
ALTER TABLE `contients`
  ADD CONSTRAINT `contients_id_categorie_foreign` FOREIGN KEY (`id_categorie`) REFERENCES `categories` (`id_categorie`) ON DELETE CASCADE,
  ADD CONSTRAINT `contients_id_oeuvre_foreign` FOREIGN KEY (`id_oeuvre`) REFERENCES `travails` (`id_oeuvre`) ON DELETE CASCADE;

--
-- Contraintes pour la table `equipes`
--
ALTER TABLE `equipes`
  ADD CONSTRAINT `equipes_id_oeuvre_foreign` FOREIGN KEY (`id_oeuvre`) REFERENCES `travails` (`id_oeuvre`) ON DELETE CASCADE,
  ADD CONSTRAINT `equipes_id_personne_foreign` FOREIGN KEY (`id_personne`) REFERENCES `personnes` (`id_personne`) ON DELETE CASCADE;

--
-- Contraintes pour la table `etablissement`
--
ALTER TABLE `etablissement`
  ADD CONSTRAINT `etablissement_id_specialite_foreign` FOREIGN KEY (`id_specialite`) REFERENCES `specialite` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `etablissement_id_type_media_foreign` FOREIGN KEY (`id_type_media`) REFERENCES `type_media` (`id_type_media`) ON DELETE CASCADE;

--
-- Contraintes pour la table `fichiers`
--
ALTER TABLE `fichiers`
  ADD CONSTRAINT `fichiers_id_dossier_foreign` FOREIGN KEY (`id_dossier`) REFERENCES `dossiers` (`id_dossier`) ON DELETE CASCADE;

--
-- Contraintes pour la table `forme`
--
ALTER TABLE `forme`
  ADD CONSTRAINT `forme_id_equipe_foreign` FOREIGN KEY (`id_equipe`) REFERENCES `equipes` (`id_equipe`) ON DELETE CASCADE,
  ADD CONSTRAINT `forme_id_personne_foreign` FOREIGN KEY (`id_personne`) REFERENCES `personnes` (`id_personne`) ON DELETE CASCADE;

--
-- Contraintes pour la table `occuper`
--
ALTER TABLE `occuper`
  ADD CONSTRAINT `occuper_id_etab_foreign` FOREIGN KEY (`id_etab`) REFERENCES `etablissement` (`id_etab`) ON DELETE CASCADE,
  ADD CONSTRAINT `occuper_id_fichier_foreign` FOREIGN KEY (`id_fichier`) REFERENCES `fichiers` (`id_fichier`) ON DELETE SET NULL,
  ADD CONSTRAINT `occuper_id_personne_foreign` FOREIGN KEY (`id_personne`) REFERENCES `personnes` (`id_personne`) ON DELETE CASCADE;

--
-- Contraintes pour la table `personnes`
--
ALTER TABLE `personnes`
  ADD CONSTRAINT `personnes_id_compte_foreign` FOREIGN KEY (`id_compte`) REFERENCES `comptes` (`id_compte`) ON DELETE CASCADE,
  ADD CONSTRAINT `personnes_id_dossier_foreign` FOREIGN KEY (`id_dossier`) REFERENCES `dossiers` (`id_dossier`) ON DELETE SET NULL;

--
-- Contraintes pour la table `peut-etre-juries`
--
ALTER TABLE `peut-etre-juries`
  ADD CONSTRAINT `peut_etre_juries_id_jury_foreign` FOREIGN KEY (`id_jury`) REFERENCES `juries` (`id_jury`) ON DELETE CASCADE,
  ADD CONSTRAINT `peut_etre_juries_id_personne_foreign` FOREIGN KEY (`id_personne`) REFERENCES `personnes` (`id_personne`) ON DELETE CASCADE;

--
-- Contraintes pour la table `peut-etre-participants`
--
ALTER TABLE `peut-etre-participants`
  ADD CONSTRAINT `peut_etre_participants_id_participant_foreign` FOREIGN KEY (`id_participant`) REFERENCES `participants` (`id_participant`) ON DELETE CASCADE,
  ADD CONSTRAINT `peut_etre_participants_id_personne_foreign` FOREIGN KEY (`id_personne`) REFERENCES `personnes` (`id_personne`) ON DELETE CASCADE;

--
-- Contraintes pour la table `travails`
--
ALTER TABLE `travails`
  ADD CONSTRAINT `travails_id_fichier_foreign` FOREIGN KEY (`id_fichier`) REFERENCES `fichiers` (`id_fichier`) ON DELETE CASCADE;

--
-- Contraintes pour la table `type_media`
--
ALTER TABLE `type_media`
  ADD CONSTRAINT `type_media_id_cat_etat_foreign` FOREIGN KEY (`id_cat_etat`) REFERENCES `categorie_etat` (`id_cat_etat`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
