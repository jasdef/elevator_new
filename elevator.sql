-- MySQL dump 10.16  Distrib 10.1.19-MariaDB, for Win32 (AMD64)
--
-- Host: localhost    Database: localhost
-- ------------------------------------------------------
-- Server version	10.1.19-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `autho` varchar(255) DEFAULT NULL,
  `lock_status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,'admin','f49d7a8565879aeb250b098e2ecaad304b8d439d9a3a42d259cbf98f48502b6e6cde7a9e437f894471a041d546f158d02a88a46890e0e6ed401a378e2595f99e','admin','all','N');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `behavior_log`
--

DROP TABLE IF EXISTS `behavior_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `behavior_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account_id` int(11) DEFAULT NULL,
  `operator` varchar(45) DEFAULT NULL,
  `modifytime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `behavior_log`
--

LOCK TABLES `behavior_log` WRITE;
/*!40000 ALTER TABLE `behavior_log` DISABLE KEYS */;
INSERT INTO `behavior_log` VALUES (1,1,'\"call Notification\"','2019-02-21 22:57:00'),(2,1,'\"call Notification\"','2019-02-21 22:57:00'),(3,1,'\"call Notification\"','2019-02-21 22:57:00'),(4,1,'\"call Notification\"','2019-02-21 22:57:00'),(5,1,'\"call Notification\"','2019-02-21 22:57:00'),(6,1,'\"call Notification\"','2019-02-21 22:57:00'),(7,1,'\"call Notification\"','2019-02-21 22:57:00'),(8,1,'\"call Notification\"','2019-02-21 22:57:00'),(9,1,'\"call Notification\"','2019-02-21 22:57:00'),(10,1,'\"call Notification\"','2019-02-21 22:57:00'),(11,1,'\"call HistoryRecordSearch\"','2019-02-21 22:57:00'),(12,1,'\"select COUNT(`account`) as count from Accoun','2019-02-21 22:57:00'),(13,1,'null','2019-02-21 22:57:00'),(14,1,'\"call Notification\"','2019-02-21 22:57:00'),(15,1,'\"call HistoryRecordSearch\"','2019-02-21 22:57:00'),(16,1,'\"select COUNT(`account`) as count from Accoun','2019-02-21 22:57:00'),(17,1,'null','2019-02-21 22:57:00'),(18,1,'\"call HistoryRecordSearch\"','2019-02-21 22:57:00'),(19,1,'\"call Notification\"','2019-02-21 22:57:55'),(20,1,'\"call HistoryRecordSearch\"','2019-02-21 22:57:59'),(21,1,'\"select COUNT(`account`) as count from accoun','2019-02-21 22:58:00'),(22,1,'\"call HistoryRecordSearch\"','2019-02-21 22:58:26'),(23,1,'\"select COUNT(`account`) as count from accoun','2019-02-21 22:58:27'),(24,1,'\"select COUNT(`account`) as count from accoun','2019-02-21 22:58:39'),(25,1,'\"select COUNT(`account`) as count from accoun','2019-02-21 22:58:40'),(26,1,'\"call Notification\"','2019-02-21 23:01:35'),(27,1,'\"call Transaction\"','2019-02-21 23:01:38'),(28,1,'\"call Notification\"','2019-02-21 23:03:22'),(29,1,'\"call Transaction\"','2019-02-21 23:03:24'),(30,1,'\"call HistoryRecordSearch\"','2019-02-21 23:03:37'),(31,1,'\"call Notification\"','2019-02-24 20:02:11'),(32,1,'\"call Notification\"','2019-02-24 20:36:04'),(33,1,'\"call Transaction\"','2019-02-24 20:36:06'),(34,1,'\"call Notification\"','2019-02-24 21:07:25'),(35,1,'\"call HistoryRecordSearch\"','2019-02-24 21:07:28'),(36,1,'\"select COUNT(`account`) as count from accoun','2019-02-24 21:07:29'),(37,1,'\"select COUNT(`account`) as count from accoun','2019-02-24 21:07:33'),(38,1,'\"select COUNT(`account`) as count from accoun','2019-02-24 21:07:35'),(39,1,'\"select COUNT(`account`) as count from accoun','2019-02-24 21:07:41'),(40,1,'\"select COUNT(`account`) as count from accoun','2019-02-24 21:07:43'),(41,1,'\"call HistoryRecordSearch\"','2019-02-24 21:37:36'),(42,1,'\"call Transaction\"','2019-02-24 22:13:10'),(43,1,'\"call Transaction\"','2019-02-24 22:22:47'),(44,1,'\"call Notification\"','2019-02-24 22:23:06'),(45,1,'\"call Transaction\"','2019-02-24 22:23:08'),(46,1,'\"select COUNT(*) as count from transaction_fo','2019-02-24 22:23:08'),(47,1,'\"call Transaction\"','2019-02-24 22:24:02'),(48,1,'\"select COUNT(*) as count from transaction_fo','2019-02-24 22:24:02'),(49,1,'\"call Transaction\"','2019-02-24 22:24:37'),(50,1,'\"select COUNT(*) as count from transaction_fo','2019-02-24 22:24:37'),(51,1,'\"call Transaction\"','2019-02-24 22:26:14'),(52,1,'\"select COUNT(*) as count from transaction_fo','2019-02-24 22:26:14'),(53,1,'\"call Transaction\"','2019-02-24 22:26:53'),(54,1,'\"select COUNT(*) as count from transaction_fo','2019-02-24 22:26:53'),(55,1,'\"call Transaction\"','2019-02-24 22:27:03'),(56,1,'\"select COUNT(*) as count from transaction_fo','2019-02-24 22:27:03'),(57,1,'\"call Notification\"','2019-02-25 22:20:03'),(58,1,'\"call Transaction\"','2019-02-25 22:20:05'),(59,1,'\"select COUNT(*) as count from transaction_fo','2019-02-25 22:20:05'),(60,1,'\"call Transaction\"','2019-02-25 22:22:08'),(61,1,'\"select COUNT(*) as count from transaction_fo','2019-02-25 22:22:08'),(62,1,'\"call Transaction\"','2019-02-25 22:22:31'),(63,1,'\"select COUNT(*) as count from transaction_fo','2019-02-25 22:22:31'),(64,1,'\"call Transaction\"','2019-02-25 22:28:25'),(65,1,'\"select COUNT(*) as count from transaction_fo','2019-02-25 22:28:25'),(66,1,'\"call Transaction\"','2019-02-25 22:28:36'),(67,1,'\"select COUNT(*) as count from transaction_fo','2019-02-25 22:28:36'),(68,1,'\"call Transaction\"','2019-02-25 22:29:00'),(69,1,'\"select COUNT(*) as count from transaction_fo','2019-02-25 22:29:01'),(70,1,'\"call Transaction\"','2019-02-25 22:29:36'),(71,1,'\"select COUNT(*) as count from transaction_fo','2019-02-25 22:29:36');
/*!40000 ALTER TABLE `behavior_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company` varchar(45) DEFAULT NULL,
  `contactor` varchar(45) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `tel` varchar(45) DEFAULT NULL,
  `fax` varchar(45) DEFAULT NULL,
  `num` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_form`
--

DROP TABLE IF EXISTS `transaction_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transaction_form` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `left_price` int(11) DEFAULT NULL,
  `total_price` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `is_return` smallint(6) DEFAULT NULL,
  `is_duty` smallint(6) DEFAULT NULL,
  `is_receipt` smallint(6) DEFAULT NULL,
  `is_signing` smallint(6) DEFAULT NULL,
  `item_name` varchar(45) DEFAULT NULL,
  `item_percent` varchar(45) DEFAULT NULL,
  `item_status` varchar(45) DEFAULT NULL,
  `elevator_num` int(11) DEFAULT NULL,
  `note` varchar(45) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_form`
--

LOCK TABLES `transaction_form` WRITE;
/*!40000 ALTER TABLE `transaction_form` DISABLE KEYS */;
INSERT INTO `transaction_form` VALUES (1,'測試',100,100,'2019-12-28 00:00:00',1,1,1,1,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `transaction_form` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-01 13:34:41
