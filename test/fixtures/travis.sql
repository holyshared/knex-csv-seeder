CREATE USER 'knex'@'localhost' IDENTIFIED BY 'knex';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP ON knex.* TO 'knex'@'localhost';

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
