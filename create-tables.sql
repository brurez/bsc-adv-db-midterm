USE music_metadata;

CREATE TABLE IF NOT EXISTS `instrument`
(
    `name` VARCHAR(255) NOT NULL,
    UNIQUE KEY `instrument_name_key` (`name`),
    PRIMARY KEY (`name`)
);

CREATE TABLE IF NOT EXISTS `genre`
(
    `name` VARCHAR(255) NOT NULL,
    UNIQUE KEY `genre_name_key` (`name`),
    PRIMARY KEY (`name`)
);

CREATE TABLE IF NOT EXISTS `country`
(
    `name` VARCHAR(255) NOT NULL,
    UNIQUE KEY `country_name_key` (`name`),
    PRIMARY KEY (`name`)
);

CREATE TABLE IF NOT EXISTS `composer`
(
    `composer_id`  BIGINT unsigned NOT NULL AUTO_INCREMENT,
    `lastname`     VARCHAR(255)    NOT NULL,
    `country_name` VARCHAR(255)    NOT NULL,
    UNIQUE KEY `composer_id_key` (`composer_id`),
    PRIMARY KEY (`composer_id`),
    FOREIGN KEY (`country_name`) REFERENCES country (`name`)
);

CREATE TABLE IF NOT EXISTS `music`
(
    `music_id`         BIGINT unsigned NOT NULL AUTO_INCREMENT,
    `title`            VARCHAR(255)    NOT NULL,
    `date_range_start` INTEGER unsigned,
    `date_range_end`   INTEGER unsigned,
    `date_exact`       INTEGER unsigned,
    `modulation`       VARCHAR(31),
    `key`              VARCHAR(31)     NOT NULL,
    `catalogue_number` VARCHAR(63),
    `composer_id`      BIGINT unsigned NOT NULL,
    UNIQUE KEY `music_id_key` (`music_id`),
    PRIMARY KEY (`music_id`),
    FOREIGN KEY (`composer_id`) REFERENCES composer (`composer_id`)
);

CREATE TABLE IF NOT EXISTS `music_instrument_join`
(
    `instrument_name` VARCHAR(255)      NOT NULL,
    `music_id`        BIGINT unsigned   NOT NULL,
    `order`           SMALLINT unsigned NOT NULL DEFAULT '1',
    UNIQUE KEY `music_id_order_key` (`music_id`, `order`),
    PRIMARY KEY (`music_id`, `order`),
    FOREIGN KEY (`instrument_name`) REFERENCES instrument (`name`),
    FOREIGN KEY (`music_id`) REFERENCES music (`music_id`)
);

CREATE TABLE IF NOT EXISTS `music_genre_join`
(
    `genre_name`  VARCHAR(255)    NOT NULL,
    `music_id`    BIGINT unsigned NOT NULL,
    `is_subgenre` BOOLEAN         NOT NULL DEFAULT 0,
    UNIQUE KEY `music_id_is_subgenre_key` (`music_id`, `is_subgenre`),
    PRIMARY KEY (`music_id`, `is_subgenre`),
    FOREIGN KEY (`genre_name`) REFERENCES genre (`name`),
    FOREIGN KEY (`music_id`) REFERENCES music (`music_id`)
);
