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
  `name` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `autho` varchar(255) DEFAULT NULL,
  `lock_status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=4432 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `contactor1` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `contactor2` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `contactor3` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `address1` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `address2` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `address3` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `tel1` varchar(255) DEFAULT NULL,
  `tel2` varchar(255) DEFAULT NULL,
  `tel3` varchar(255) DEFAULT NULL,
  `fax1` varchar(255) DEFAULT NULL,
  `fax2` varchar(255) DEFAULT NULL,
  `fax3` varchar(255) DEFAULT NULL,
  `num` varchar(255) DEFAULT NULL,
  `is_delete` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dispatch_log`
--

DROP TABLE IF EXISTS `dispatch_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dispatch_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_type` smallint(6) DEFAULT NULL,
  `table_id` int(11) DEFAULT NULL,
  `dispatcher` int(11) DEFAULT NULL,
  `principal` int(11) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `action_type` smallint(6) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dispatch_status_log`
--

DROP TABLE IF EXISTS `dispatch_status_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dispatch_status_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dispatch_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `action_type` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `file_mapping`
--

DROP TABLE IF EXISTS `file_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `file_mapping` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_type` smallint(6) DEFAULT NULL,
  `table_id` int(11) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  `file_type` smallint(6) DEFAULT NULL,
  `is_delete` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fix_form`
--

DROP TABLE IF EXISTS `fix_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fix_form` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `total_price` int(11) DEFAULT NULL,
  `left_price` int(11) DEFAULT NULL,
  `num` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `status` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `fix_item` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `note` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `staff_id` int(11) DEFAULT '0',
  `customer_id` int(11) DEFAULT '0',
  `is_delete` int(11) DEFAULT '0',
  `items` tinytext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `modify_project`
--

DROP TABLE IF EXISTS `modify_project`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `modify_project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `left_price` int(11) DEFAULT NULL,
  `total_price` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `is_return` smallint(6) DEFAULT NULL,
  `is_duty` smallint(6) DEFAULT NULL,
  `is_receipt` smallint(6) DEFAULT NULL,
  `is_signing` smallint(6) DEFAULT '0',
  `elevator_num` int(11) DEFAULT NULL,
  `note` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `items` tinytext CHARACTER SET utf8,
  `is_delete` int(11) DEFAULT '0',
  `is_stamp` smallint(6) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `service_form`
--

DROP TABLE IF EXISTS `service_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_form` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` datetime DEFAULT NULL,
  `service_month` smallint(6) DEFAULT NULL,
  `mechanical_warranty` smallint(6) DEFAULT NULL,
  `license_date` datetime DEFAULT NULL,
  `total_price` int(11) DEFAULT '0',
  `left_price` int(11) DEFAULT '0',
  `has_license` smallint(6) DEFAULT NULL,
  `note` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `is_signing` smallint(6) DEFAULT NULL,
  `is_remind` smallint(6) DEFAULT NULL,
  `warranty_id` int(11) DEFAULT '0',
  `service_times` int(11) DEFAULT '0',
  `do_times` int(11) DEFAULT '0',
  `touch_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` int(11) DEFAULT '0',
  `items` tinytext,
  `dispatch_month` int(11) DEFAULT '0',
  `is_dispatch` int(11) DEFAULT '0',
  `staff_id` int(11) DEFAULT '0',
  `customer_id` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `is_signing` smallint(6) DEFAULT '0',
  `elevator_num` int(11) DEFAULT NULL,
  `note` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `items` tinytext CHARACTER SET utf8,
  `is_delete` int(11) DEFAULT '0',
  `is_stamp` smallint(6) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `warranty_form`
--

DROP TABLE IF EXISTS `warranty_form`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `warranty_form` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) CHARACTER SET utf8 DEFAULT NULL,
  `mechanical_warranty` smallint(6) DEFAULT NULL,
  `free_maintenance` smallint(6) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `warranty_times` int(11) DEFAULT '0',
  `is_signing` smallint(6) DEFAULT NULL,
  `is_remind` smallint(6) DEFAULT '0',
  `touch_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `is_delete` int(11) DEFAULT '0',
  `transaction_id` int(11) DEFAULT NULL,
  `modify_month` int(11) DEFAULT '0',
  `is_dispatch` int(11) DEFAULT '0',
  `staff_id` int(11) DEFAULT '0',
  `customer_id` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-17  0:16:46
