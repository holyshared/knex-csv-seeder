CREATE DATABASE knex CHARACTER SET = 'utf8';

CREATE USER 'knex'@'localhost' IDENTIFIED BY 'knex';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP ON knex.* TO 'knex'@'localhost';

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
