-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 04, 2021 at 07:29 PM
-- Server version: 10.4.18-MariaDB
-- PHP Version: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vacationsdb`
--
CREATE DATABASE IF NOT EXISTS `vacationsdb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `vacationsdb`;

-- --------------------------------------------------------

--
-- Table structure for table `followers`
--

CREATE TABLE `followers` (
  `vacationId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `followers`
--

INSERT INTO `followers` (`vacationId`, `userId`) VALUES
(4, 7),
(2, 7),
(7, 7);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `uuid` varchar(500) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(500) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uuid`, `firstName`, `lastName`, `username`, `password`, `isAdmin`) VALUES
(7, 'c5eea05e-cd65-4cd2-8998-b1925f4cbbf0', 'Moshe', 'haimon', 'moshke', '109f583e6c268576f11d78cb3d388e958de1455d5fdb4d2e9495b95ca6d0c80cfd74f55b932e7415ea2f57ec2f5e15207adf689a064b4222c3b2f498f33d8f67', NULL),
(8, '6cc318ce-88fe-4e7a-a083-7a39d6cadb5c', 'Erel', 'Zohar', 'erel1234', 'dba54fc568766bc901bbaabdbf7095cbf2aac7bf90843c6383ef58190386d5a1dad3f2f29f685bb0f8ab5da422ec9ad0a305aee1aa37a12dd3e620b8bc61cc3b', 1),
(9, '2eea4e0d-0353-4847-8f39-03debb2fdf2f', 'haim', 'moshe', 'mosh777', '762d8e8d18854e2295acf34a3a34d55c2b494d394e5c082893850e727bb866205b8b923cf0143a2b1f6a56417291898690361081290c3d3fe63965ecd6f25896', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `vacations`
--

CREATE TABLE `vacations` (
  `id` int(11) NOT NULL,
  `uuid` varchar(400) NOT NULL,
  `destination` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `price` int(5) NOT NULL,
  `vacationStart` date NOT NULL,
  `vacationEnd` date NOT NULL,
  `followersCount` int(11) NOT NULL,
  `imageName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vacations`
--

INSERT INTO `vacations` (`id`, `uuid`, `destination`, `description`, `price`, `vacationStart`, `vacationEnd`, `followersCount`, `imageName`) VALUES
(2, 'cvghjikmnbjh456gf4n5fhdnht6gsnag3', 'Thailand', 'A lot of chineese people', 5000, '2021-06-01', '2021-06-15', 1, 'cvghjikmnbjh456gf4n5fhdnht6gsnag3.jpg'),
(4, '4jyh6897erj4nf68j4d6hf4mn6t5mjte', 'Rio de jeneiro', 'Exotic vacation.', 1900, '2021-06-22', '2021-06-29', 1, '4jyh6897erj4nf68j4d6hf4mn6t5mjte.jpg'),
(7, 'ghpbjriohj0hu76461vb1hh6', 'Prague', 'Very Nice', 30, '2015-08-10', '2015-08-10', 1, 'ghpbjriohj0hu76461vb1hh6.jpg'),
(20, '9861bc68-bb04-47bc-9be3-5877904a1adf', 'Malibu', 'Cool Place', 2222, '2021-06-28', '2021-06-24', 0, '9861bc68-bb04-47bc-9be3-5877904a1adf.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `followers`
--
ALTER TABLE `followers`
  ADD KEY `vacationId` (`vacationId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `isAdmin` (`isAdmin`),
  ADD UNIQUE KEY `isAdmin_2` (`isAdmin`);

--
-- Indexes for table `vacations`
--
ALTER TABLE `vacations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `vacations`
--
ALTER TABLE `vacations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `followers`
--
ALTER TABLE `followers`
  ADD CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `followers_ibfk_2` FOREIGN KEY (`vacationId`) REFERENCES `vacations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
